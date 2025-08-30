-- Function to determine channel
CREATE OR REPLACE FUNCTION get_sales_channel(
    p_sales_org TEXT,
    p_material_type TEXT,
    p_billing_type TEXT,
    p_business_area TEXT,
    p_sold_to_party TEXT,
    p_mat_desc TEXT,
    p_material_code TEXT
) RETURNS TEXT AS $$
BEGIN
    -- E-com
    IF p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_billing_type <> 'F3' 
       AND p_business_area IN ('LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70')
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'REJ%' THEN
        RETURN 'E-com';
    END IF;

    -- EBO
    IF p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area IN ('LI28', 'LI80')
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' THEN
        RETURN 'EBO';
    END IF;

    -- LFS
    IF p_sales_org <> 'LI05' AND p_sales_org IN ('3000','AR01','AS01','EB01','JM01','JM02','JM03','JT01','LC01','LC02','LC03','LC04','LC05','LC06','LI01','LI02','LI03','LI04','LI06','LI07','LI09','LI10','LX01','LX02','LX03','LX04','ON01')
       AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        RETURN 'LFS';
    END IF;

    -- Export
    IF p_material_type IN ('FERT', 'HAWA') AND p_billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR')
       AND p_business_area NOT IN ('LI26', 'LI38') AND p_mat_desc NOT ILIKE 'REJ%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND EXISTS (SELECT 1 FROM lux_production.export_customer_list WHERE "Code" = p_sold_to_party) THEN
        RETURN 'Export';
    END IF;

    -- Export Domestic
    IF p_sales_org = 'LI04' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        RETURN 'Export Domestic';
    END IF;

    -- Lux Parker Inner
    IF p_sales_org = 'LI10' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN
        RETURN 'Lux Parker Inner';
    END IF;

    -- Lux Pynk
    IF p_sales_org = 'LI09' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN
        RETURN 'Lux Pynk';
    END IF;

    -- Onn - Winter
    IF p_sales_org IN ('LI02','LI03','LI07') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND (EXISTS (SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = p_material_code)
            OR EXISTS (SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = p_material_code)) THEN
        RETURN 'Onn - Winter';
    END IF;

    -- Lux Cozi Outerwear Men
    IF p_sales_org = 'LI06' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Lux Cozi Outerwear Men';
    END IF;

    -- Winter
    IF p_sales_org = 'LI03' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Winter';
    END IF;

    -- Onn
    IF p_sales_org = 'LI02' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Onn';
    END IF;

    -- Lux Cozi
    IF p_sales_org = 'LI01' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Lux Cozi';
    END IF;

    -- Lux Cozi Boys
    IF p_sales_org IN ('LI01','LI06') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND (p_mat_desc ILIKE '%boyz%' OR p_mat_desc ILIKE '%boys%')
       AND EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Lux Cozi Boys';
    END IF;

    -- Default logic
    IF EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        RETURN 'LFS';
    END IF;

    RETURN 'Others';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to determine brand
CREATE OR REPLACE FUNCTION get_sales_brand(p_channel TEXT, p_material_number TEXT) RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN p_channel IN ('Lux Cozi', 'Lux Cozi Boys', 'Lux Cozi Outerwear Men') THEN RETURN 'Lux Cozi';
        WHEN p_channel IN ('Onn', 'Onn - Winter') THEN RETURN 'Onn';
        WHEN p_channel = 'Export Domestic' THEN RETURN 'Others';
        WHEN p_channel = 'Export' THEN RETURN 'Export';
        WHEN p_channel = 'Lux Pynk' THEN RETURN 'Lux Pynk';
        WHEN p_channel = 'Lux Parker Inner' THEN RETURN 'Lux Parker Inner';
        WHEN p_channel = 'Winter' THEN RETURN 'Winter';
        WHEN p_channel = 'Others' THEN RETURN 'Others';
        WHEN p_channel IN ('LFS', 'E-com', 'EBO') THEN
            -- Check brand logic table
            IF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Lux Cozi') THEN
                RETURN 'Lux Cozi';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Lux Winter') THEN
                RETURN 'Winter';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Lux Parker Inner') THEN
                RETURN 'Lux Parker Inner';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Lux Pynk') THEN
                RETURN 'Lux Pynk';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Onn') THEN
                RETURN 'Onn';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Others') THEN
                RETURN 'Others';
            END IF;
    END CASE;
    
    RETURN 'Others';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to map sizes
CREATE OR REPLACE FUNCTION get_mapped_size(p_material_size TEXT, p_gender TEXT) RETURNS TEXT AS $$
BEGIN
    -- Kids sizes
    IF COALESCE(p_gender, '') = 'KIDS' THEN
        CASE p_material_size
            WHEN '025' THEN RETURN '25';
            WHEN '030' THEN RETURN '30';
            WHEN '035' THEN RETURN '35';
            WHEN '040' THEN RETURN '40';
            WHEN '045' THEN RETURN '45';
            WHEN '050' THEN RETURN '50';
            WHEN '055' THEN RETURN '55';
            WHEN '060' THEN RETURN '60';
            WHEN '065' THEN RETURN '65';
            WHEN '070' THEN RETURN '70';
            WHEN '073' THEN RETURN '73';
            WHEN '075' THEN RETURN 'XS/75';
            WHEN '080' THEN RETURN 'S/80';
            WHEN '085' THEN RETURN 'M/85';
            WHEN '090' THEN RETURN 'L/90';
            WHEN '095' THEN RETURN 'XL/95';
            WHEN '100' THEN RETURN 'XXL/100';
            WHEN '00S' THEN RETURN 'S/80';
            WHEN '00M' THEN RETURN 'M/85';
            WHEN '00L' THEN RETURN 'L/90';
            WHEN '0XL' THEN RETURN 'XL/95';
            WHEN '0XS' THEN RETURN 'XS/75';
            WHEN 'XXL' THEN RETURN 'XXL/100';
            WHEN '3XL' THEN RETURN '3XL/105';
            WHEN '4XL' THEN RETURN '4XL/110';
            WHEN '5XL' THEN RETURN '5XL/115';
        END CASE;
    ELSE
        -- Adult sizes
        CASE p_material_size
            WHEN '0XS', '030', '075' THEN RETURN 'XS/75';
            WHEN '00S', '032', '080' THEN RETURN 'S/80';
            WHEN '00M', '034', '085' THEN RETURN 'M/85';
            WHEN '00L', '036', '090' THEN RETURN 'L/90';
            WHEN '0XL', '038', '095' THEN RETURN 'XL/95';
            WHEN 'XXL', '2XL', '040', '100' THEN RETURN 'XXL/100';
            WHEN '3XL', '042', '105' THEN RETURN '3XL/105';
            WHEN '4XL', '044', '110' THEN RETURN '4XL/110';
            WHEN '5XL', '046', '115', 'SXL' THEN RETURN '5XL/115';
            WHEN '6XL', '048', '120' THEN RETURN '6XL/120';
        END CASE;
    END IF;
    
    RETURN 'FREE SIZE';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

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
        get_sales_channel(s.sales_org, m.material_type, s.billing_type, s.business_area, s.sold_to_party, s.mat_desc, s.material_code) AS channel,
        get_mapped_size(m.material_size, g."Gender") AS mapped_size,
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
    "Size (Material Size)", channel, mapped_size,
    get_sales_brand(channel, "Material Number") AS brand,
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
    "Size (Material Size)", channel, mapped_size
WITH DATA;