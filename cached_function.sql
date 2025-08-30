-- Create hash tables for caching (run once)
CREATE TEMP TABLE IF NOT EXISTS temp_lfs AS SELECT "Sold_to_Party" FROM lux_production.lfs_customer_list;
CREATE TEMP TABLE IF NOT EXISTS temp_export AS SELECT "Code" FROM lux_production.export_customer_list;
CREATE TEMP TABLE IF NOT EXISTS temp_annexure_1 AS SELECT "Material_Number" FROM lux_production.annexure_1;
CREATE TEMP TABLE IF NOT EXISTS temp_annexure_2 AS SELECT "Material_Number" FROM lux_production.annexure_2;
CREATE TEMP TABLE IF NOT EXISTS temp_annexure_3 AS SELECT "Material_Number" FROM lux_production.annexure_3;
CREATE TEMP TABLE IF NOT EXISTS temp_brand_logic AS SELECT "Material_Number", "Re_Brand" FROM lux_production.brand_logic;
CREATE TEMP TABLE IF NOT EXISTS temp_gender AS SELECT old_matl_number::text, "Gender" FROM lux_production.gender;

CREATE INDEX ON temp_lfs("Sold_to_Party");
CREATE INDEX ON temp_export("Code");
CREATE INDEX ON temp_annexure_1("Material_Number");
CREATE INDEX ON temp_annexure_2("Material_Number");
CREATE INDEX ON temp_annexure_3("Material_Number");
CREATE INDEX ON temp_brand_logic("Material_Number");
CREATE INDEX ON temp_gender(old_matl_number);

-- Fast cached function
CREATE OR REPLACE FUNCTION lux_staging.get_channel_brand_size_cached(
    p_sales_org TEXT, p_material_type TEXT, p_billing_type TEXT, p_business_area TEXT,
    p_sold_to_party TEXT, p_mat_desc TEXT, p_material_code TEXT, p_material_size TEXT, p_old_matl_number TEXT
) RETURNS TABLE(channel TEXT, brand TEXT, mapped_size TEXT) AS $$
DECLARE
    v_channel TEXT; v_brand TEXT; v_size TEXT; v_gender TEXT; v_brand_logic TEXT;
    v_is_lfs BOOLEAN; v_is_export BOOLEAN; v_in_a1 BOOLEAN; v_in_a2 BOOLEAN; v_in_a3 BOOLEAN;
BEGIN
    -- Fast lookups using temp tables
    SELECT EXISTS(SELECT 1 FROM temp_lfs WHERE "Sold_to_Party" = p_sold_to_party) INTO v_is_lfs;
    SELECT EXISTS(SELECT 1 FROM temp_export WHERE "Code" = p_sold_to_party) INTO v_is_export;
    SELECT EXISTS(SELECT 1 FROM temp_annexure_1 WHERE "Material_Number" = p_material_code) INTO v_in_a1;
    SELECT EXISTS(SELECT 1 FROM temp_annexure_2 WHERE "Material_Number" = p_material_code) INTO v_in_a2;
    SELECT EXISTS(SELECT 1 FROM temp_annexure_3 WHERE "Material_Number" = p_material_code) INTO v_in_a3;
    SELECT "Gender" INTO v_gender FROM temp_gender WHERE old_matl_number = p_old_matl_number;
    SELECT "Re_Brand" INTO v_brand_logic FROM temp_brand_logic WHERE "Material_Number" = p_material_code LIMIT 1;

    -- Channel logic
    v_channel := CASE
        WHEN p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_billing_type <> 'F3' 
             AND p_business_area IN ('LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70')
             AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'REJ%' THEN 'E-com'
        WHEN p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area IN ('LI28', 'LI80')
             AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' THEN 'EBO'
        WHEN p_sales_org <> 'LI05' AND p_sales_org IN ('3000','AR01','AS01','EB01','JM01','JM02','JM03','JT01','LC01','LC02','LC03','LC04','LC05','LC06','LI01','LI02','LI03','LI04','LI06','LI07','LI09','LI10','LX01','LX02','LX03','LX04','ON01')
             AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38') AND p_mat_desc NOT ILIKE 'REJ%' AND v_is_lfs THEN 'LFS'
        WHEN p_material_type IN ('FERT', 'HAWA') AND p_billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR') AND p_business_area NOT IN ('LI26', 'LI38') 
             AND p_mat_desc NOT ILIKE 'REJ%' AND NOT v_is_lfs AND v_is_export THEN 'Export'
        WHEN p_sales_org = 'LI04' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND NOT v_is_lfs THEN 'Export Domestic'
        WHEN p_sales_org = 'LI10' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN 'Lux Parker Inner'
        WHEN p_sales_org = 'LI09' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN 'Lux Pynk'
        WHEN p_sales_org IN ('LI02','LI03','LI07') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
             AND (v_in_a1 OR v_in_a2) THEN 'Onn - Winter'
        WHEN p_sales_org = 'LI06' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_a3 THEN 'Lux Cozi Outerwear Men'
        WHEN p_sales_org = 'LI03' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_a1 THEN 'Winter'
        WHEN p_sales_org = 'LI02' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_a2 THEN 'Onn'
        WHEN p_sales_org = 'LI01' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_a3 THEN 'Lux Cozi'
        WHEN p_sales_org IN ('LI01','LI06') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
             AND (p_mat_desc ILIKE '%boyz%' OR p_mat_desc ILIKE '%boys%') AND v_in_a3 THEN 'Lux Cozi Boys'
        WHEN v_is_lfs THEN 'LFS'
        ELSE 'Others'
    END;

    -- Brand logic
    v_brand := CASE 
        WHEN v_channel IN ('Lux Cozi', 'Lux Cozi Boys', 'Lux Cozi Outerwear Men') THEN 'Lux Cozi'
        WHEN v_channel IN ('Onn', 'Onn - Winter') THEN 'Onn'
        WHEN v_channel = 'Export Domestic' THEN 'Others'
        WHEN v_channel = 'Export' THEN 'Export'
        WHEN v_channel = 'Lux Pynk' THEN 'Lux Pynk'
        WHEN v_channel = 'Lux Parker Inner' THEN 'Lux Parker Inner'
        WHEN v_channel = 'Winter' THEN 'Winter'
        WHEN v_channel = 'Others' THEN 'Others'
        WHEN v_channel IN ('LFS', 'E-com', 'EBO') THEN COALESCE(v_brand_logic, 'Others')
        ELSE 'Others'
    END;

    -- Size mapping
    v_size := CASE
        WHEN COALESCE(v_gender, '') = 'KIDS' THEN
            CASE p_material_size
                WHEN '025' THEN '25' WHEN '030' THEN '30' WHEN '035' THEN '35' WHEN '040' THEN '40' WHEN '045' THEN '45'
                WHEN '050' THEN '50' WHEN '055' THEN '55' WHEN '060' THEN '60' WHEN '065' THEN '65' WHEN '070' THEN '70'
                WHEN '073' THEN '73' WHEN '075' THEN 'XS/75' WHEN '080' THEN 'S/80' WHEN '085' THEN 'M/85' WHEN '090' THEN 'L/90'
                WHEN '095' THEN 'XL/95' WHEN '100' THEN 'XXL/100' WHEN '00S' THEN 'S/80' WHEN '00M' THEN 'M/85' WHEN '00L' THEN 'L/90'
                WHEN '0XL' THEN 'XL/95' WHEN '0XS' THEN 'XS/75' WHEN 'XXL' THEN 'XXL/100' WHEN '3XL' THEN '3XL/105'
                WHEN '4XL' THEN '4XL/110' WHEN '5XL' THEN '5XL/115' ELSE 'FREE SIZE'
            END
        ELSE
            CASE 
                WHEN p_material_size IN ('0XS', '030', '075') THEN 'XS/75'
                WHEN p_material_size IN ('00S', '032', '080') THEN 'S/80'
                WHEN p_material_size IN ('00M', '034', '085') THEN 'M/85'
                WHEN p_material_size IN ('00L', '036', '090') THEN 'L/90'
                WHEN p_material_size IN ('0XL', '038', '095') THEN 'XL/95'
                WHEN p_material_size IN ('XXL', '2XL', '040', '100') THEN 'XXL/100'
                WHEN p_material_size IN ('3XL', '042', '105') THEN '3XL/105'
                WHEN p_material_size IN ('4XL', '044', '110') THEN '4XL/110'
                WHEN p_material_size IN ('5XL', '046', '115', 'SXL') THEN '5XL/115'
                WHEN p_material_size IN ('6XL', '048', '120') THEN '6XL/120'
                ELSE 'FREE SIZE'
            END
    END;

    RETURN QUERY SELECT v_channel, v_brand, v_size;
END;
$$ LANGUAGE plpgsql STABLE;

-- Materialized view using cached function
CREATE MATERIALIZED VIEW lux_staging.sales_master_finalv9_cached
AS 
SELECT 
    s.ref_num AS "Ref Num", s.billing_document AS "Billing Doc No", s.billing_type AS "Billing Type",
    s.sales_org AS "Sales Org ", s.billing_date AS "Billing Date", s.region AS "Region",
    s.comp_code AS "Company Code", s.sold_to_party AS "Sold To Party", s.material_code AS "Material Number",
    s.mat_desc AS "Material Desc", s.plant AS "Plant", s.dist_chan AS distribution_channel,
    s.sales_unit AS "Sales Unit", s.business_area AS "Business Area", s.profit_center AS "Profit Center",
    m.material_type AS "Material Type", m.industry_sector AS "Sub Brand (Industry Sec)",
    m.basic_material AS "Category (Basic Material)", m.material_style AS "Style (Material Style)",
    g."Gender" AS "Gender (Old Mat No)", m.base_mat_desc AS "Basic Material Desc",
    m.material_color AS "Color (Material color)", m.material_size AS "Size (Material Size)",
    f.channel, f.mapped_size, f.brand,
    SUM(s.no_of_pkg::numeric) AS "Total Number of Package",
    SUM(s.net_amt / NULLIF(s.exch_rate, 0)) AS "net_amt_FC",
    SUM(s.tax_amt / NULLIF(s.exch_rate, 0)) AS "tax_amt_FC",
    SUM(s.cost_amt / NULLIF(s.exch_rate, 0)) AS "cost_amt_FC",
    SUM(CASE WHEN s.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -s.actual_billed_quantity ELSE s.actual_billed_quantity END) AS total_actual_billed_quantity,
    SUM(CASE WHEN s.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -s."billing_qty_in_PC" ELSE s."billing_qty_in_PC" END) AS "Total qty",
    SUM(CASE WHEN s.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -s.cost_amt ELSE s.cost_amt END) AS "Total COGS",
    SUM(CASE WHEN s.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN 
        CASE WHEN s.doc_curr = 'USD' OR s.sold_to_party = 'NPBI002' THEN -(s.tax_amt + s.net_amt) ELSE -s.net_amt END
        ELSE CASE WHEN s.doc_curr = 'USD' OR s.sold_to_party = 'NPBI002' THEN s.tax_amt + s.net_amt ELSE s.net_amt END END) AS "Total Gross Sales"
FROM lux_production."TR_SD_BILL_customer_DTLS_PROD" s
LEFT JOIN lux_staging.report_material_master m ON s.material_code = m.material_number
LEFT JOIN lux_production.gender g ON m.old_matl_number = g.old_matl_number::text
LEFT JOIN LATERAL lux_staging.get_channel_brand_size_cached(s.sales_org, m.material_type, s.billing_type, s.business_area, s.sold_to_party, s.mat_desc, s.material_code, m.material_size, m.old_matl_number) f ON true
WHERE s.biliing_status = false AND s.billing_type IN ('F2','F3','IV','FOCT','ZRES','ZRE','ZRER','ZRF','ZRR')
    AND (m.material_type IS NULL OR m.material_type NOT IN ('ZYRN','DIEN'))
    AND NOT EXISTS (SELECT 1 FROM lux_production.cust_exclusion WHERE "Cust_code" = s.sold_to_party)
GROUP BY s.ref_num, s.billing_document, s.billing_type, s.sales_org, s.billing_date, s.region, s.comp_code, s.sold_to_party, s.material_code, s.mat_desc, s.plant, s.dist_chan, s.sales_unit, s.business_area, s.profit_center, m.material_type, m.industry_sector, m.basic_material, m.material_style, g."Gender", m.base_mat_desc, m.material_color, m.material_size, f.channel, f.mapped_size, f.brand
WITH DATA;