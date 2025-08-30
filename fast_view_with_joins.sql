-- Fast Materialized View with pre-joined lookup tables
CREATE MATERIALIZED VIEW lux_staging.sales_master_finalv9_fast
TABLESPACE pg_default
AS 
WITH lookup_data AS (
    SELECT 
        s.ref_num,
        s.billing_document,
        s.billing_type,
        s.sales_org,
        s.billing_date,
        s.region,
        s.comp_code,
        s.sold_to_party,
        s.material_code,
        s.mat_desc,
        s.plant,
        s.dist_chan,
        s.sales_unit,
        s.business_area,
        s.profit_center,
        m.material_type,
        m.industry_sector,
        m.basic_material,
        m.material_style,
        g."Gender",
        m.base_mat_desc,
        m.material_color,
        m.material_size,
        m.old_matl_number,
        s.no_of_pkg,
        s.net_amt,
        s.tax_amt,
        s.cost_amt,
        s.exch_rate,
        s.actual_billed_quantity,
        s."billing_qty_in_PC",
        s.doc_curr,
        -- Lookup flags
        CASE WHEN lfs."Sold_to_Party" IS NOT NULL THEN true ELSE false END AS is_lfs,
        CASE WHEN exp.Code IS NOT NULL THEN true ELSE false END AS is_export,
        CASE WHEN a1."Material_Number" IS NOT NULL THEN true ELSE false END AS in_annexure_1,
        CASE WHEN a2."Material_Number" IS NOT NULL THEN true ELSE false END AS in_annexure_2,
        CASE WHEN a3."Material_Number" IS NOT NULL THEN true ELSE false END AS in_annexure_3,
        bl."Re_Brand" AS brand_logic
    FROM lux_production."TR_SD_BILL_customer_DTLS_PROD" s
    LEFT JOIN lux_staging.report_material_master m ON s.material_code = m.material_number
    LEFT JOIN lux_production.gender g ON m.old_matl_number = g.old_matl_number::text
    LEFT JOIN lux_production.lfs_customer_list lfs ON s.sold_to_party = lfs."Sold_to_Party"
    LEFT JOIN lux_production.export_customer_list exp ON s.sold_to_party = exp.Code
    LEFT JOIN lux_production.annexure_1 a1 ON s.material_code = a1."Material_Number"
    LEFT JOIN lux_production.annexure_2 a2 ON s.material_code = a2."Material_Number"
    LEFT JOIN lux_production.annexure_3 a3 ON s.material_code = a3."Material_Number"
    LEFT JOIN lux_production.brand_logic bl ON s.material_code = bl."Material_Number"
    WHERE s.biliing_status = false 
        AND s.billing_type IN ('F2','F3','IV','FOCT','ZRES','ZRE','ZRER','ZRF','ZRR')
        AND (m.material_type IS NULL OR m.material_type NOT IN ('ZYRN','DIEN'))
        AND NOT EXISTS (SELECT 1 FROM lux_production.cust_exclusion WHERE "Cust_code" = s.sold_to_party)
),
base AS (
    SELECT 
        ref_num AS "Ref Num",
        billing_document AS "Billing Doc No",
        billing_type AS "Billing Type",
        sales_org AS "Sales Org ",
        billing_date AS "Billing Date",
        region AS "Region",
        comp_code AS "Company Code",
        sold_to_party AS "Sold To Party",
        material_code AS "Material Number",
        mat_desc AS "Material Desc",
        plant AS "Plant",
        dist_chan AS distribution_channel,
        sales_unit AS "Sales Unit",
        business_area AS "Business Area",
        profit_center AS "Profit Center",
        material_type AS "Material Type",
        industry_sector AS "Sub Brand (Industry Sec)",
        basic_material AS "Category (Basic Material)",
        material_style AS "Style (Material Style)",
        "Gender" AS "Gender (Old Mat No)",
        base_mat_desc AS "Basic Material Desc",
        material_color AS "Color (Material color)",
        material_size AS "Size (Material Size)",
        -- Channel logic using pre-joined data
        CASE
            WHEN sales_org = 'LI05' AND material_type IN ('FERT', 'HAWA') AND billing_type <> 'F3' 
                 AND business_area IN ('LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70')
                 AND NOT is_lfs AND mat_desc NOT ILIKE 'REJ%' THEN 'E-com'
            WHEN sales_org = 'LI05' AND material_type IN ('FERT', 'HAWA') AND business_area IN ('LI28', 'LI80')
                 AND NOT is_lfs AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' THEN 'EBO'
            WHEN sales_org <> 'LI05' AND sales_org IN ('3000','AR01','AS01','EB01','JM01','JM02','JM03','JT01','LC01','LC02','LC03','LC04','LC05','LC06','LI01','LI02','LI03','LI04','LI06','LI07','LI09','LI10','LX01','LX02','LX03','LX04','ON01')
                 AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND is_lfs THEN 'LFS'
            WHEN material_type IN ('FERT', 'HAWA') AND billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR')
                 AND business_area NOT IN ('LI26', 'LI38') AND mat_desc NOT ILIKE 'REJ%'
                 AND NOT is_lfs AND is_export THEN 'Export'
            WHEN sales_org = 'LI04' AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND NOT is_lfs THEN 'Export Domestic'
            WHEN sales_org = 'LI10' AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' AND NOT is_lfs
                 AND mat_desc NOT ILIKE 'AX%' AND mat_desc NOT ILIKE 'One8%' THEN 'Lux Parker Inner'
            WHEN sales_org = 'LI09' AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' AND NOT is_lfs
                 AND mat_desc NOT ILIKE 'AX%' AND mat_desc NOT ILIKE 'One8%' THEN 'Lux Pynk'
            WHEN sales_org IN ('LI02','LI03','LI07') AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' AND NOT is_lfs
                 AND mat_desc NOT ILIKE 'AX%' AND mat_desc NOT ILIKE 'One8%'
                 AND (in_annexure_1 OR in_annexure_2) THEN 'Onn - Winter'
            WHEN sales_org = 'LI06' AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' AND NOT is_lfs
                 AND mat_desc NOT ILIKE 'AX%' AND mat_desc NOT ILIKE 'One8%' AND NOT in_annexure_3 THEN 'Lux Cozi Outerwear Men'
            WHEN sales_org = 'LI03' AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' AND NOT is_lfs
                 AND mat_desc NOT ILIKE 'AX%' AND mat_desc NOT ILIKE 'One8%' AND NOT in_annexure_1 THEN 'Winter'
            WHEN sales_org = 'LI02' AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' AND NOT is_lfs
                 AND mat_desc NOT ILIKE 'AX%' AND mat_desc NOT ILIKE 'One8%' AND NOT in_annexure_2 THEN 'Onn'
            WHEN sales_org = 'LI01' AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' AND NOT is_lfs
                 AND mat_desc NOT ILIKE 'AX%' AND mat_desc NOT ILIKE 'One8%' AND NOT in_annexure_3 THEN 'Lux Cozi'
            WHEN sales_org IN ('LI01','LI06') AND material_type IN ('FERT', 'HAWA') AND business_area NOT IN ('LI26', 'LI38')
                 AND mat_desc NOT ILIKE 'REJ%' AND billing_type <> 'F3' AND NOT is_lfs
                 AND mat_desc NOT ILIKE 'AX%' AND mat_desc NOT ILIKE 'One8%'
                 AND (mat_desc ILIKE '%boyz%' OR mat_desc ILIKE '%boys%') AND in_annexure_3 THEN 'Lux Cozi Boys'
            WHEN is_lfs THEN 'LFS'
            ELSE 'Others'
        END AS channel,
        -- Size mapping
        CASE
            WHEN COALESCE("Gender", '') = 'KIDS' THEN
                CASE material_size
                    WHEN '025' THEN '25' WHEN '030' THEN '30' WHEN '035' THEN '35' WHEN '040' THEN '40' WHEN '045' THEN '45'
                    WHEN '050' THEN '50' WHEN '055' THEN '55' WHEN '060' THEN '60' WHEN '065' THEN '65' WHEN '070' THEN '70'
                    WHEN '073' THEN '73' WHEN '075' THEN 'XS/75' WHEN '080' THEN 'S/80' WHEN '085' THEN 'M/85' WHEN '090' THEN 'L/90'
                    WHEN '095' THEN 'XL/95' WHEN '100' THEN 'XXL/100' WHEN '00S' THEN 'S/80' WHEN '00M' THEN 'M/85' WHEN '00L' THEN 'L/90'
                    WHEN '0XL' THEN 'XL/95' WHEN '0XS' THEN 'XS/75' WHEN 'XXL' THEN 'XXL/100' WHEN '3XL' THEN '3XL/105'
                    WHEN '4XL' THEN '4XL/110' WHEN '5XL' THEN '5XL/115' ELSE 'FREE SIZE'
                END
            ELSE
                CASE 
                    WHEN material_size IN ('0XS', '030', '075') THEN 'XS/75'
                    WHEN material_size IN ('00S', '032', '080') THEN 'S/80'
                    WHEN material_size IN ('00M', '034', '085') THEN 'M/85'
                    WHEN material_size IN ('00L', '036', '090') THEN 'L/90'
                    WHEN material_size IN ('0XL', '038', '095') THEN 'XL/95'
                    WHEN material_size IN ('XXL', '2XL', '040', '100') THEN 'XXL/100'
                    WHEN material_size IN ('3XL', '042', '105') THEN '3XL/105'
                    WHEN material_size IN ('4XL', '044', '110') THEN '4XL/110'
                    WHEN material_size IN ('5XL', '046', '115', 'SXL') THEN '5XL/115'
                    WHEN material_size IN ('6XL', '048', '120') THEN '6XL/120'
                    ELSE 'FREE SIZE'
                END
        END AS mapped_size,
        brand_logic,
        no_of_pkg::numeric AS no_of_pkg,
        net_amt / NULLIF(exch_rate, 0) AS net_amt_fc,
        tax_amt / NULLIF(exch_rate, 0) AS tax_amt_fc,
        cost_amt / NULLIF(exch_rate, 0) AS cost_amt_fc,
        CASE WHEN billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -actual_billed_quantity ELSE actual_billed_quantity END AS actual_billed_qty,
        CASE WHEN billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -"billing_qty_in_PC" ELSE "billing_qty_in_PC" END AS billing_qty_pc,
        CASE WHEN billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -cost_amt ELSE cost_amt END AS cost_amt_adj,
        CASE 
            WHEN billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN
                CASE WHEN doc_curr = 'USD' OR sold_to_party = 'NPBI002' THEN -(tax_amt + net_amt) ELSE -net_amt END
            ELSE
                CASE WHEN doc_curr = 'USD' OR sold_to_party = 'NPBI002' THEN tax_amt + net_amt ELSE net_amt END
        END AS gross_sales
    FROM lookup_data
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
            CASE brand_logic
                WHEN 'Lux Cozi' THEN 'Lux Cozi'
                WHEN 'Lux Winter' THEN 'Winter'
                WHEN 'Lux Parker Inner' THEN 'Lux Parker Inner'
                WHEN 'Lux Pynk' THEN 'Lux Pynk'
                WHEN 'Onn' THEN 'Onn'
                WHEN 'Others' THEN 'Others'
                ELSE 'Others'
            END
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
    "Size (Material Size)", channel, mapped_size, brand_logic
WITH DATA;