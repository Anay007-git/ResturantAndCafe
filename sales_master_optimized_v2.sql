-- Optimized materialized view with reduced hardcoding
CREATE MATERIALIZED VIEW lux_staging.sales_master_optimized
TABLESPACE pg_default
AS 
WITH constants AS (
    SELECT 
        ARRAY['F2','F3','IV','FOCT','ZRES','ZRE','ZRER','ZRF','ZRR'] AS valid_billing_types,
        ARRAY['ZYRN','DIEN'] AS excluded_material_types,
        ARRAY['ZRE','ZRER','ZRF','ZRR','ZRES'] AS return_billing_types,
        ARRAY['LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70'] AS ecom_business_areas,
        ARRAY['LI28','LI80'] AS ebo_business_areas,
        ARRAY['LI26','LI38'] AS excluded_business_areas
),
lookup_flags AS (
    SELECT 
        s.ref_num, s.billing_document, s.billing_type, s.sales_org, s.billing_date,
        s.region, s.comp_code, s.sold_to_party, s.material_code, s.mat_desc,
        s.plant, s.dist_chan, s.sales_unit, s.business_area, s.profit_center,
        m.material_type, m.industry_sector, m.basic_material, m.material_style,
        g."Gender", m.base_mat_desc, m.material_color, m.material_size,
        s.no_of_pkg, s.net_amt, s.tax_amt, s.cost_amt, s.exch_rate,
        s.actual_billed_quantity, s."billing_qty_in_PC", s.doc_curr,
        lfs."Sold_to_Party" IS NOT NULL AS is_lfs,
        exp."Code" IS NOT NULL AS is_export,
        a1."Material_Number" IS NOT NULL AS in_a1,
        a2."Material_Number" IS NOT NULL AS in_a2,
        a3."Material_Number" IS NOT NULL AS in_a3,
        bl."Re_Brand" AS brand_logic
    FROM lux_production."TR_SD_BILL_customer_DTLS_PROD" s
    CROSS JOIN constants c
    LEFT JOIN lux_staging.report_material_master m ON s.material_code = m.material_number
    LEFT JOIN lux_production.gender g ON m.old_matl_number = g.old_matl_number::text
    LEFT JOIN lux_production.lfs_customer_list lfs ON s.sold_to_party = lfs."Sold_to_Party"
    LEFT JOIN lux_production.export_customer_list exp ON s.sold_to_party = exp."Code"::text
    LEFT JOIN lux_production.annexure_1 a1 ON s.material_code = a1."Material_Number"
    LEFT JOIN lux_production.annexure_2 a2 ON s.material_code = a2."Material_Number"
    LEFT JOIN lux_production.annexure_3 a3 ON s.material_code = a3."Material_Number"
    LEFT JOIN lux_production.brand_logic bl ON s.material_code = bl."Material_Number"
    WHERE s.biliing_status = FALSE
      AND s.billing_type = ANY(c.valid_billing_types)
      AND (m.material_type IS NULL OR NOT (m.material_type = ANY(c.excluded_material_types)))
      AND NOT EXISTS (SELECT 1 FROM lux_production.cust_exclusion WHERE "Cust_code"::text = s.sold_to_party)
),
channel_mapped AS (
    SELECT lf.*,
        CASE 
            WHEN lf.sales_org = 'LI05' AND lf.material_type IN ('FERT','HAWA') AND lf.billing_type != 'F3' 
                 AND lf.business_area = ANY(c.ecom_business_areas) 
                 AND NOT lf.is_lfs AND lf.mat_desc NOT ILIKE 'REJ%' THEN 'E-com'
            WHEN lf.sales_org = 'LI05' AND lf.material_type IN ('FERT','HAWA') 
                 AND lf.business_area = ANY(c.ebo_business_areas)
                 AND NOT lf.is_lfs AND lf.mat_desc NOT ILIKE 'REJ%' AND lf.billing_type != 'F3' THEN 'EBO'
            WHEN lf.is_lfs THEN 'LFS'
            WHEN lf.material_type IN ('FERT','HAWA') AND lf.billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR')
                 AND NOT lf.business_area = ANY(c.excluded_business_areas)
                 AND lf.mat_desc NOT ILIKE 'REJ%' AND NOT lf.is_lfs AND lf.is_export THEN 'Export'
            WHEN lf.sales_org = 'LI04' AND NOT lf.is_lfs THEN 'Export Domestic'
            ELSE 'Others'
        END AS channel
    FROM lookup_flags lf
    CROSS JOIN constants c
),
size_mapped AS (
    SELECT cm.*,
        CASE 
            WHEN COALESCE(cm."Gender", '') = 'KIDS' THEN
                CASE cm.material_size
                    WHEN '025' THEN '25' WHEN '030' THEN '30' WHEN '035' THEN '35'
                    WHEN '040' THEN '40' WHEN '045' THEN '45' WHEN '050' THEN '50'
                    WHEN '075' THEN 'XS/75' WHEN '080' THEN 'S/80' WHEN '085' THEN 'M/85'
                    WHEN '090' THEN 'L/90' WHEN '095' THEN 'XL/95' WHEN '100' THEN 'XXL/100'
                    WHEN '00S' THEN 'S/80' WHEN '00M' THEN 'M/85' WHEN '00L' THEN 'L/90'
                    WHEN '0XL' THEN 'XL/95' WHEN '0XS' THEN 'XS/75' WHEN 'XXL' THEN 'XXL/100'
                    WHEN '3XL' THEN '3XL/105' WHEN '4XL' THEN '4XL/110' WHEN '5XL' THEN '5XL/115'
                    ELSE 'FREE SIZE'
                END
            ELSE
                CASE 
                    WHEN cm.material_size IN ('0XS','030','075') THEN 'XS/75'
                    WHEN cm.material_size IN ('00S','032','080') THEN 'S/80'
                    WHEN cm.material_size IN ('00M','034','085') THEN 'M/85'
                    WHEN cm.material_size IN ('00L','036','090') THEN 'L/90'
                    WHEN cm.material_size IN ('0XL','038','095') THEN 'XL/95'
                    WHEN cm.material_size IN ('XXL','2XL','040','100') THEN 'XXL/100'
                    WHEN cm.material_size IN ('3XL','042','105') THEN '3XL/105'
                    WHEN cm.material_size IN ('4XL','044','110') THEN '4XL/110'
                    WHEN cm.material_size IN ('5XL','046','115','SXL') THEN '5XL/115'
                    WHEN cm.material_size IN ('6XL','048','120') THEN '6XL/120'
                    ELSE 'FREE SIZE'
                END
        END AS mapped_size
    FROM channel_mapped cm
),
base AS (
    SELECT 
        sm.ref_num AS "Ref Num", sm.billing_document AS "Billing Doc No",
        sm.billing_type AS "Billing Type", sm.sales_org AS "Sales Org ",
        sm.billing_date AS "Billing Date", sm.region AS "Region",
        sm.comp_code AS "Company Code", sm.sold_to_party AS "Sold To Party",
        sm.material_code AS "Material Number", sm.mat_desc AS "Material Desc",
        sm.plant AS "Plant", sm.dist_chan AS distribution_channel,
        sm.sales_unit AS "Sales Unit", sm.business_area AS "Business Area",
        sm.profit_center AS "Profit Center", sm.material_type AS "Material Type",
        sm.industry_sector AS "Sub Brand (Industry Sec)",
        sm.basic_material AS "Category (Basic Material)",
        sm.material_style AS "Style (Material Style)",
        sm."Gender" AS "Gender (Old Mat No)",
        sm.base_mat_desc AS "Basic Material Desc",
        sm.material_color AS "Color (Material color)",
        sm.material_size AS "Size (Material Size)",
        sm.channel, sm.mapped_size,
        CASE
            WHEN sm.channel IN ('Lux Cozi','Lux Cozi Boys','Lux Cozi Outerwear Men') THEN 'Lux Cozi'
            WHEN sm.channel IN ('Onn','Onn - Winter') THEN 'Onn'
            WHEN sm.channel = 'Export Domestic' THEN 'Others'
            WHEN sm.channel IN ('LFS','E-com','EBO') THEN COALESCE(sm.brand_logic, 'Others')
            ELSE sm.channel
        END AS brand,
        sm.brand_logic,
        sm.no_of_pkg::numeric AS no_of_pkg,
        sm.net_amt / NULLIF(sm.exch_rate, 0) AS net_amt_fc,
        sm.tax_amt / NULLIF(sm.exch_rate, 0) AS tax_amt_fc,
        sm.cost_amt / NULLIF(sm.exch_rate, 0) AS cost_amt_fc,
        CASE WHEN sm.billing_type = ANY(c.return_billing_types) 
             THEN -sm.actual_billed_quantity ELSE sm.actual_billed_quantity END AS actual_billed_qty,
        CASE WHEN sm.billing_type = ANY(c.return_billing_types)
             THEN -sm."billing_qty_in_PC" ELSE sm."billing_qty_in_PC" END AS billing_qty_pc,
        CASE WHEN sm.billing_type = ANY(c.return_billing_types)
             THEN -sm.cost_amt ELSE sm.cost_amt END AS cost_amt_adj,
        CASE WHEN sm.billing_type = ANY(c.return_billing_types) THEN
                CASE WHEN sm.doc_curr = 'USD' OR sm.sold_to_party = 'NPBI002' 
                     THEN -(sm.tax_amt + sm.net_amt) ELSE -sm.net_amt END
             ELSE
                CASE WHEN sm.doc_curr = 'USD' OR sm.sold_to_party = 'NPBI002'
                     THEN sm.tax_amt + sm.net_amt ELSE sm.net_amt END
        END AS gross_sales
    FROM size_mapped sm
    CROSS JOIN constants c
)
SELECT 
    "Ref Num", "Billing Doc No", "Billing Type", "Sales Org ", "Region",
    "Company Code", "Billing Date", "Sold To Party", "Material Number",
    "Material Desc", "Plant", distribution_channel, "Sales Unit", "Business Area",
    "Profit Center", "Material Type", "Sub Brand (Industry Sec)",
    "Category (Basic Material)", "Style (Material Style)", "Gender (Old Mat No)",
    "Basic Material Desc", "Color (Material color)", "Size (Material Size)",
    channel, mapped_size, brand,
    SUM(no_of_pkg) AS "Total Number of Package",
    SUM(net_amt_fc) AS "net_amt_FC",
    SUM(tax_amt_fc) AS "tax_amt_FC",
    SUM(cost_amt_fc) AS "cost_amt_FC", 
    SUM(actual_billed_qty) AS total_actual_billed_quantity,
    SUM(billing_qty_pc) AS "Total qty",
    SUM(cost_amt_adj) AS "Total COGS",
    SUM(gross_sales) AS "Total Gross Sales"
FROM base
GROUP BY "Ref Num", "Billing Doc No", "Billing Type", "Sales Org ", "Billing Date",
         "Region", "Company Code", "Sold To Party", "Material Number", "Material Desc",
         "Plant", distribution_channel, "Sales Unit", "Business Area", "Profit Center",
         "Material Type", "Sub Brand (Industry Sec)", "Category (Basic Material)",
         "Style (Material Style)", "Gender (Old Mat No)", "Basic Material Desc",
         "Color (Material color)", "Size (Material Size)", channel, mapped_size, brand
WITH DATA;

-- Performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_master_billing_date 
ON lux_staging.sales_master_optimized ("Billing Date");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_master_channel_brand 
ON lux_staging.sales_master_optimized (channel, brand);