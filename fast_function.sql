-- Fast function using hash tables for lookups
CREATE OR REPLACE FUNCTION lux_staging.get_channel_brand_size_fast(
    p_sales_org TEXT,
    p_material_type TEXT,
    p_billing_type TEXT,
    p_business_area TEXT,
    p_sold_to_party TEXT,
    p_mat_desc TEXT,
    p_material_code TEXT,
    p_material_size TEXT,
    p_old_matl_number TEXT
) RETURNS TABLE(channel TEXT, brand TEXT, mapped_size TEXT) AS $$
DECLARE
    v_channel TEXT;
    v_brand TEXT;
    v_size TEXT;
    v_gender TEXT;
    v_is_lfs BOOLEAN := false;
    v_is_export BOOLEAN := false;
    v_in_annexure_1 BOOLEAN := false;
    v_in_annexure_2 BOOLEAN := false;
    v_in_annexure_3 BOOLEAN := false;
    v_brand_logic TEXT;
BEGIN
    -- Single queries with direct lookups
    SELECT EXISTS(SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) INTO v_is_lfs;
    SELECT EXISTS(SELECT 1 FROM lux_production.export_customer_list WHERE "Code" = p_sold_to_party) INTO v_is_export;
    SELECT EXISTS(SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = p_material_code) INTO v_in_annexure_1;
    SELECT EXISTS(SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = p_material_code) INTO v_in_annexure_2;
    SELECT EXISTS(SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) INTO v_in_annexure_3;
    SELECT "Gender" INTO v_gender FROM lux_production.gender WHERE old_matl_number::text = p_old_matl_number;
    SELECT "Re_Brand" INTO v_brand_logic FROM lux_production.brand_logic WHERE "Material_Number" = p_material_code LIMIT 1;

    -- Channel logic
    IF p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_billing_type <> 'F3' 
       AND p_business_area IN ('LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70')
       AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'REJ%' THEN
        v_channel := 'E-com';
    ELSIF p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area IN ('LI28', 'LI80')
       AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' THEN
        v_channel := 'EBO';
    ELSIF p_sales_org <> 'LI05' AND p_sales_org IN ('3000','AR01','AS01','EB01','JM01','JM02','JM03','JT01','LC01','LC02','LC03','LC04','LC05','LC06','LI01','LI02','LI03','LI04','LI06','LI07','LI09','LI10','LX01','LX02','LX03','LX04','ON01')
       AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND v_is_lfs THEN
        v_channel := 'LFS';
    ELSIF p_material_type IN ('FERT', 'HAWA') AND p_billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR')
       AND p_business_area NOT IN ('LI26', 'LI38') AND p_mat_desc NOT ILIKE 'REJ%'
       AND NOT v_is_lfs AND v_is_export THEN
        v_channel := 'Export';
    ELSIF p_sales_org = 'LI04' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND NOT v_is_lfs THEN
        v_channel := 'Export Domestic';
    ELSIF p_sales_org = 'LI10' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN
        v_channel := 'Lux Parker Inner';
    ELSIF p_sales_org = 'LI09' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN
        v_channel := 'Lux Pynk';
    ELSIF p_sales_org IN ('LI02','LI03','LI07') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND (v_in_annexure_1 OR v_in_annexure_2) THEN
        v_channel := 'Onn - Winter';
    ELSIF p_sales_org = 'LI06' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_annexure_3 THEN
        v_channel := 'Lux Cozi Outerwear Men';
    ELSIF p_sales_org = 'LI03' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_annexure_1 THEN
        v_channel := 'Winter';
    ELSIF p_sales_org = 'LI02' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_annexure_2 THEN
        v_channel := 'Onn';
    ELSIF p_sales_org = 'LI01' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_annexure_3 THEN
        v_channel := 'Lux Cozi';
    ELSIF p_sales_org IN ('LI01','LI06') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND (p_mat_desc ILIKE '%boyz%' OR p_mat_desc ILIKE '%boys%') AND v_in_annexure_3 THEN
        v_channel := 'Lux Cozi Boys';
    ELSIF v_is_lfs THEN
        v_channel := 'LFS';
    ELSE
        v_channel := 'Others';
    END IF;

    -- Brand logic
    IF v_channel IN ('Lux Cozi', 'Lux Cozi Boys', 'Lux Cozi Outerwear Men') THEN
        v_brand := 'Lux Cozi';
    ELSIF v_channel IN ('Onn', 'Onn - Winter') THEN
        v_brand := 'Onn';
    ELSIF v_channel = 'Export Domestic' THEN
        v_brand := 'Others';
    ELSIF v_channel = 'Export' THEN
        v_brand := 'Export';
    ELSIF v_channel = 'Lux Pynk' THEN
        v_brand := 'Lux Pynk';
    ELSIF v_channel = 'Lux Parker Inner' THEN
        v_brand := 'Lux Parker Inner';
    ELSIF v_channel = 'Winter' THEN
        v_brand := 'Winter';
    ELSIF v_channel = 'Others' THEN
        v_brand := 'Others';
    ELSIF v_channel IN ('LFS', 'E-com', 'EBO') THEN
        v_brand := CASE v_brand_logic
            WHEN 'Lux Cozi' THEN 'Lux Cozi'
            WHEN 'Lux Winter' THEN 'Winter'
            WHEN 'Lux Parker Inner' THEN 'Lux Parker Inner'
            WHEN 'Lux Pynk' THEN 'Lux Pynk'
            WHEN 'Onn' THEN 'Onn'
            WHEN 'Others' THEN 'Others'
            ELSE 'Others'
        END;
    ELSE
        v_brand := 'Others';
    END IF;

    -- Size mapping
    IF COALESCE(v_gender, '') = 'KIDS' THEN
        v_size := CASE p_material_size
            WHEN '025' THEN '25' WHEN '030' THEN '30' WHEN '035' THEN '35' WHEN '040' THEN '40' WHEN '045' THEN '45'
            WHEN '050' THEN '50' WHEN '055' THEN '55' WHEN '060' THEN '60' WHEN '065' THEN '65' WHEN '070' THEN '70'
            WHEN '073' THEN '73' WHEN '075' THEN 'XS/75' WHEN '080' THEN 'S/80' WHEN '085' THEN 'M/85' WHEN '090' THEN 'L/90'
            WHEN '095' THEN 'XL/95' WHEN '100' THEN 'XXL/100' WHEN '00S' THEN 'S/80' WHEN '00M' THEN 'M/85' WHEN '00L' THEN 'L/90'
            WHEN '0XL' THEN 'XL/95' WHEN '0XS' THEN 'XS/75' WHEN 'XXL' THEN 'XXL/100' WHEN '3XL' THEN '3XL/105'
            WHEN '4XL' THEN '4XL/110' WHEN '5XL' THEN '5XL/115' ELSE 'FREE SIZE'
        END;
    ELSE
        v_size := CASE 
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
        END;
    END IF;

    RETURN QUERY SELECT v_channel, v_brand, v_size;
END;
$$ LANGUAGE plpgsql STABLE;

-- Optimized Materialized View
CREATE MATERIALIZED VIEW lux_staging.sales_master_finalv9_optimized
TABLESPACE pg_default
AS 
WITH base AS (
    SELECT 
        s.ref_num AS "Ref Num",
        s.billing_document AS "Billing Doc No",
        s.billing_type AS "Billing Type",
        s.sales_org AS "Sales Org ",
        s.billing_date AS "Billing Date",
        s.region AS "Region",
        s.comp_code AS "Company Code",
        s.sold_to_party AS "Sold To Party",
        s.material_code AS "Material Number",
        s.mat_desc AS "Material Desc",
        s.plant AS "Plant",
        s.dist_chan AS distribution_channel,
        s.sales_unit AS "Sales Unit",
        s.business_area AS "Business Area",
        s.profit_center AS "Profit Center",
        m.material_type AS "Material Type",
        m.industry_sector AS "Sub Brand (Industry Sec)",
        m.basic_material AS "Category (Basic Material)",
        m.material_style AS "Style (Material Style)",
        g."Gender" AS "Gender (Old Mat No)",
        m.base_mat_desc AS "Basic Material Desc",
        m.material_color AS "Color (Material color)",
        m.material_size AS "Size (Material Size)",
        f.channel,
        f.brand,
        f.mapped_size,
        s.no_of_pkg::numeric AS no_of_pkg,
        s.net_amt / NULLIF(s.exch_rate, 0) AS net_amt_fc,
        s.tax_amt / NULLIF(s.exch_rate, 0) AS tax_amt_fc,
        s.cost_amt / NULLIF(s.exch_rate, 0) AS cost_amt_fc,
        CASE WHEN s.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -s.actual_billed_quantity ELSE s.actual_billed_quantity END AS actual_billed_qty,
        CASE WHEN s.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -s."billing_qty_in_PC" ELSE s."billing_qty_in_PC" END AS billing_qty_pc,
        CASE WHEN s.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -s.cost_amt ELSE s.cost_amt END AS cost_amt_adj,
        CASE 
            WHEN s.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN
                CASE WHEN s.doc_curr = 'USD' OR s.sold_to_party = 'NPBI002' THEN -(s.tax_amt + s.net_amt) ELSE -s.net_amt END
            ELSE
                CASE WHEN s.doc_curr = 'USD' OR s.sold_to_party = 'NPBI002' THEN s.tax_amt + s.net_amt ELSE s.net_amt END
        END AS gross_sales
    FROM lux_production."TR_SD_BILL_customer_DTLS_PROD" s
    LEFT JOIN lux_staging.report_material_master m ON s.material_code = m.material_number
    LEFT JOIN lux_production.gender g ON m.old_matl_number = g.old_matl_number::text
    LEFT JOIN LATERAL lux_staging.get_channel_brand_size_fast(
        s.sales_org, m.material_type, s.billing_type, s.business_area, 
        s.sold_to_party, s.mat_desc, s.material_code, m.material_size, m.old_matl_number
    ) f ON true
    WHERE s.biliing_status = false 
        AND s.billing_type IN ('F2','F3','IV','FOCT','ZRES','ZRE','ZRER','ZRF','ZRR')
        AND (m.material_type IS NULL OR m.material_type NOT IN ('ZYRN','DIEN'))
        AND NOT EXISTS (SELECT 1 FROM lux_production.cust_exclusion WHERE "Cust_code" = s.sold_to_party)
)
SELECT 
    "Ref Num", "Billing Doc No", "Billing Type", "Sales Org ", "Region", "Company Code", "Billing Date",
    "Sold To Party", "Material Number", "Material Desc", "Plant", distribution_channel, "Sales Unit",
    "Business Area", "Profit Center", "Material Type", "Sub Brand (Industry Sec)", "Category (Basic Material)",
    "Style (Material Style)", "Gender (Old Mat No)", "Basic Material Desc", "Color (Material color)",
    "Size (Material Size)", channel, mapped_size, brand,
    SUM(no_of_pkg) AS "Total Number of Package",
    SUM(net_amt_fc) AS "net_amt_FC",
    SUM(tax_amt_fc) AS "tax_amt_FC",
    SUM(cost_amt_fc) AS "cost_amt_FC",
    SUM(actual_billed_qty) AS total_actual_billed_quantity,
    SUM(billing_qty_pc) AS "Total qty",
    SUM(cost_amt_adj) AS "Total COGS",
    SUM(gross_sales) AS "Total Gross Sales"
FROM base
GROUP BY "Ref Num", "Billing Doc No", "Billing Type", "Sales Org ", "Billing Date", "Region", "Company Code",
    "Sold To Party", "Material Number", "Material Desc", "Plant", distribution_channel, "Sales Unit",
    "Business Area", "Profit Center", "Material Type", "Sub Brand (Industry Sec)", "Category (Basic Material)",
    "Style (Material Style)", "Gender (Old Mat No)", "Basic Material Desc", "Color (Material color)",
    "Size (Material Size)", channel, mapped_size, brand
WITH DATA;