-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lfs_customer_sold_to_party ON lux_production.lfs_customer_list("Sold_to_Party");
CREATE INDEX IF NOT EXISTS idx_export_customer_code ON lux_production.export_customer_list("Code");
CREATE INDEX IF NOT EXISTS idx_annexure_1_material ON lux_production.annexure_1("Material_Number");
CREATE INDEX IF NOT EXISTS idx_annexure_2_material ON lux_production.annexure_2("Material_Number");
CREATE INDEX IF NOT EXISTS idx_annexure_3_material ON lux_production.annexure_3("Material_Number");
CREATE INDEX IF NOT EXISTS idx_brand_logic_material ON lux_production.brand_logic("Material_Number");
CREATE INDEX IF NOT EXISTS idx_gender_old_matl ON lux_production.gender(old_matl_number);

-- Simple materialized view without function
CREATE MATERIALIZED VIEW lux_staging.sales_master_finalv9_simple
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
        -- Channel using EXISTS with indexes
        CASE
            WHEN s.sales_org = 'LI05' AND m.material_type IN ('FERT', 'HAWA') AND s.billing_type <> 'F3' 
                 AND s.business_area IN ('LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70')
                 AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'REJ%' THEN 'E-com'
            WHEN s.sales_org = 'LI05' AND m.material_type IN ('FERT', 'HAWA') AND s.business_area IN ('LI28', 'LI80')
                 AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' THEN 'EBO'
            WHEN s.sales_org <> 'LI05' AND s.sales_org IN ('3000','AR01','AS01','EB01','JM01','JM02','JM03','JT01','LC01','LC02','LC03','LC04','LC05','LC06','LI01','LI02','LI03','LI04','LI06','LI07','LI09','LI10','LX01','LX02','LX03','LX04','ON01')
                 AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party) THEN 'LFS'
            WHEN m.material_type IN ('FERT', 'HAWA') AND s.billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR')
                 AND s.business_area NOT IN ('LI26', 'LI38') AND s.mat_desc NOT ILIKE 'REJ%'
                 AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND EXISTS (SELECT 1 FROM lux_production.export_customer_list WHERE "Code" = s.sold_to_party) THEN 'Export'
            WHEN s.sales_org = 'LI04' AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party) THEN 'Export Domestic'
            WHEN s.sales_org = 'LI10' AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'AX%' AND s.mat_desc NOT ILIKE 'One8%' THEN 'Lux Parker Inner'
            WHEN s.sales_org = 'LI09' AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'AX%' AND s.mat_desc NOT ILIKE 'One8%' THEN 'Lux Pynk'
            WHEN s.sales_org IN ('LI02','LI03','LI07') AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'AX%' AND s.mat_desc NOT ILIKE 'One8%'
                 AND (EXISTS (SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = s.material_code)
                      OR EXISTS (SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = s.material_code)) THEN 'Onn - Winter'
            WHEN s.sales_org = 'LI06' AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'AX%' AND s.mat_desc NOT ILIKE 'One8%' AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = s.material_code) THEN 'Lux Cozi Outerwear Men'
            WHEN s.sales_org = 'LI03' AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'AX%' AND s.mat_desc NOT ILIKE 'One8%' AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = s.material_code) THEN 'Winter'
            WHEN s.sales_org = 'LI02' AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'AX%' AND s.mat_desc NOT ILIKE 'One8%' AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = s.material_code) THEN 'Onn'
            WHEN s.sales_org = 'LI01' AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'AX%' AND s.mat_desc NOT ILIKE 'One8%' AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = s.material_code) THEN 'Lux Cozi'
            WHEN s.sales_org IN ('LI01','LI06') AND m.material_type IN ('FERT', 'HAWA') AND s.business_area NOT IN ('LI26', 'LI38')
                 AND s.mat_desc NOT ILIKE 'REJ%' AND s.billing_type <> 'F3' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party)
                 AND s.mat_desc NOT ILIKE 'AX%' AND s.mat_desc NOT ILIKE 'One8%'
                 AND (s.mat_desc ILIKE '%boyz%' OR s.mat_desc ILIKE '%boys%') AND EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = s.material_code) THEN 'Lux Cozi Boys'
            WHEN EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = s.sold_to_party) THEN 'LFS'
            ELSE 'Others'
        END AS channel,
        -- Size mapping
        CASE
            WHEN COALESCE(g."Gender", '') = 'KIDS' THEN
                CASE m.material_size
                    WHEN '025' THEN '25' WHEN '030' THEN '30' WHEN '035' THEN '35' WHEN '040' THEN '40' WHEN '045' THEN '45'
                    WHEN '050' THEN '50' WHEN '055' THEN '55' WHEN '060' THEN '60' WHEN '065' THEN '65' WHEN '070' THEN '70'
                    WHEN '073' THEN '73' WHEN '075' THEN 'XS/75' WHEN '080' THEN 'S/80' WHEN '085' THEN 'M/85' WHEN '090' THEN 'L/90'
                    WHEN '095' THEN 'XL/95' WHEN '100' THEN 'XXL/100' WHEN '00S' THEN 'S/80' WHEN '00M' THEN 'M/85' WHEN '00L' THEN 'L/90'
                    WHEN '0XL' THEN 'XL/95' WHEN '0XS' THEN 'XS/75' WHEN 'XXL' THEN 'XXL/100' WHEN '3XL' THEN '3XL/105'
                    WHEN '4XL' THEN '4XL/110' WHEN '5XL' THEN '5XL/115' ELSE 'FREE SIZE'
                END
            ELSE
                CASE 
                    WHEN m.material_size IN ('0XS', '030', '075') THEN 'XS/75'
                    WHEN m.material_size IN ('00S', '032', '080') THEN 'S/80'
                    WHEN m.material_size IN ('00M', '034', '085') THEN 'M/85'
                    WHEN m.material_size IN ('00L', '036', '090') THEN 'L/90'
                    WHEN m.material_size IN ('0XL', '038', '095') THEN 'XL/95'
                    WHEN m.material_size IN ('XXL', '2XL', '040', '100') THEN 'XXL/100'
                    WHEN m.material_size IN ('3XL', '042', '105') THEN '3XL/105'
                    WHEN m.material_size IN ('4XL', '044', '110') THEN '4XL/110'
                    WHEN m.material_size IN ('5XL', '046', '115', 'SXL') THEN '5XL/115'
                    WHEN m.material_size IN ('6XL', '048', '120') THEN '6XL/120'
                    ELSE 'FREE SIZE'
                END
        END AS mapped_size,
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
    -- Brand logic
    CASE 
        WHEN channel IN ('Lux Cozi', 'Lux Cozi Boys', 'Lux Cozi Outerwear Men') THEN 'Lux Cozi'
        WHEN channel IN ('Onn', 'Onn - Winter') THEN 'Onn'
        WHEN channel = 'Export Domestic' THEN 'Others'
        WHEN channel = 'Export' THEN 'Export'
        WHEN channel = 'Lux Pynk' THEN 'Lux Pynk'
        WHEN channel = 'Lux Parker Inner' THEN 'Lux Parker Inner'
        WHEN channel = 'Winter' THEN 'Winter'
        WHEN channel = 'Others' THEN 'Others'
        WHEN channel IN ('LFS', 'E-com', 'EBO') THEN
            COALESCE((SELECT "Re_Brand" FROM lux_production.brand_logic WHERE "Material_Number" = "Material Number" LIMIT 1), 'Others')
        ELSE 'Others'
    END AS brand,
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