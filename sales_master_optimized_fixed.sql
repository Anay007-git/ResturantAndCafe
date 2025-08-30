-- Configuration tables to replace hardcoded values
CREATE TABLE IF NOT EXISTS lux_config.billing_types (
    billing_type TEXT PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS lux_config.excluded_material_types (
    material_type TEXT PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS lux_config.business_areas (
    business_area TEXT PRIMARY KEY,
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS lux_config.sales_orgs (
    sales_org TEXT PRIMARY KEY,
    org_type TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS lux_config.size_mappings (
    original_size TEXT PRIMARY KEY,
    mapped_size_kids TEXT,
    mapped_size_adult TEXT
);

CREATE TABLE IF NOT EXISTS lux_config.channel_rules (
    rule_id SERIAL PRIMARY KEY,
    sales_org TEXT,
    material_types TEXT[],
    billing_types TEXT[],
    business_areas TEXT[],
    conditions JSONB,
    channel_name TEXT,
    priority INTEGER
);

-- Insert configuration data
INSERT INTO lux_config.billing_types VALUES 
('F2', TRUE), ('F3', TRUE), ('IV', TRUE), ('FOCT', TRUE), 
('ZRES', TRUE), ('ZRE', TRUE), ('ZRER', TRUE), ('ZRF', TRUE), ('ZRR', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO lux_config.excluded_material_types VALUES 
('ZYRN', TRUE), ('DIEN', TRUE)
ON CONFLICT DO NOTHING;

-- Optimized materialized view
CREATE MATERIALIZED VIEW lux_staging.sales_master_optimized
TABLESPACE pg_default
AS 
WITH config_data AS (
    SELECT 
        array_agg(bt.billing_type) AS valid_billing_types,
        array_agg(emt.material_type) AS excluded_material_types
    FROM lux_config.billing_types bt
    CROSS JOIN lux_config.excluded_material_types emt
    WHERE bt.is_active AND emt.is_active
),
lookup_flags AS (
    SELECT 
        s.ref_num, s.billing_document, s.billing_type, s.sales_org,
        s.billing_date, s.region, s.comp_code, s.sold_to_party,
        s.material_code, s.mat_desc, s.plant, s.dist_chan,
        s.sales_unit, s.business_area, s.profit_center,
        m.material_type, m.industry_sector, m.basic_material,
        m.material_style, g."Gender", m.base_mat_desc,
        m.material_color, m.material_size, m.old_matl_number,
        s.no_of_pkg, s.net_amt, s.tax_amt, s.cost_amt,
        s.exch_rate, s.actual_billed_quantity, s."billing_qty_in_PC",
        s.doc_curr,
        lfs."Sold_to_Party" IS NOT NULL AS is_lfs,
        exp."Code" IS NOT NULL AS is_export,
        a1."Material_Number" IS NOT NULL AS in_a1,
        a2."Material_Number" IS NOT NULL AS in_a2,
        a3."Material_Number" IS NOT NULL AS in_a3,
        bl."Re_Brand" AS brand_logic
    FROM lux_production."TR_SD_BILL_customer_DTLS_PROD" s
    CROSS JOIN config_data c
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
      AND NOT EXISTS (
          SELECT 1 FROM lux_production.cust_exclusion 
          WHERE "Cust_code"::text = s.sold_to_party
      )
),
channel_logic AS (
    SELECT 
        lf.*,
        CASE 
            WHEN lf.sales_org = 'LI05' AND lf.material_type IN ('FERT', 'HAWA') 
                 AND lf.billing_type != 'F3' AND lf.business_area IN (
                     'LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49',
                     'LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70'
                 ) AND NOT lf.is_lfs AND lf.mat_desc NOT ILIKE 'REJ%' THEN 'E-com'
            WHEN lf.sales_org = 'LI05' AND lf.material_type IN ('FERT', 'HAWA')
                 AND lf.business_area IN ('LI28', 'LI80') AND NOT lf.is_lfs 
                 AND lf.mat_desc NOT ILIKE 'REJ%' AND lf.billing_type != 'F3' THEN 'EBO'
            WHEN lf.is_lfs THEN 'LFS'
            WHEN lf.is_export AND lf.billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR') THEN 'Export'
            WHEN lf.sales_org = 'LI04' AND NOT lf.is_lfs THEN 'Export Domestic'
            ELSE 'Others'
        END AS channel
    FROM lookup_flags lf
),
size_mapped AS (
    SELECT 
        cl.*,
        CASE 
            WHEN COALESCE(cl."Gender", '') = 'KIDS' THEN 
                COALESCE(sm.mapped_size_kids, 'FREE SIZE')
            ELSE 
                COALESCE(sm.mapped_size_adult, 'FREE SIZE')
        END AS mapped_size
    FROM channel_logic cl
    LEFT JOIN lux_config.size_mappings sm ON cl.material_size = sm.original_size
),
base AS (
    SELECT 
        sm.ref_num AS "Ref Num",
        sm.billing_document AS "Billing Doc No",
        sm.billing_type AS "Billing Type",
        sm.sales_org AS "Sales Org ",
        sm.billing_date AS "Billing Date",
        sm.region AS "Region",
        sm.comp_code AS "Company Code",
        sm.sold_to_party AS "Sold To Party",
        sm.material_code AS "Material Number",
        sm.mat_desc AS "Material Desc",
        sm.plant AS "Plant",
        sm.dist_chan AS distribution_channel,
        sm.sales_unit AS "Sales Unit",
        sm.business_area AS "Business Area",
        sm.profit_center AS "Profit Center",
        sm.material_type AS "Material Type",
        sm.industry_sector AS "Sub Brand (Industry Sec)",
        sm.basic_material AS "Category (Basic Material)",
        sm.material_style AS "Style (Material Style)",
        sm."Gender" AS "Gender (Old Mat No)",
        sm.base_mat_desc AS "Basic Material Desc",
        sm.material_color AS "Color (Material color)",
        sm.material_size AS "Size (Material Size)",
        sm.channel,
        sm.mapped_size,
        CASE
            WHEN sm.channel IN ('Lux Cozi', 'Lux Cozi Boys', 'Lux Cozi Outerwear Men') THEN 'Lux Cozi'
            WHEN sm.channel IN ('Onn', 'Onn - Winter') THEN 'Onn'
            WHEN sm.channel = 'Export Domestic' THEN 'Others'
            WHEN sm.channel IN ('LFS', 'E-com', 'EBO') THEN COALESCE(sm.brand_logic, 'Others')
            ELSE sm.channel
        END AS brand,
        sm.brand_logic,
        sm.no_of_pkg::numeric AS no_of_pkg,
        sm.net_amt / NULLIF(sm.exch_rate, 0) AS net_amt_fc,
        sm.tax_amt / NULLIF(sm.exch_rate, 0) AS tax_amt_fc,
        sm.cost_amt / NULLIF(sm.exch_rate, 0) AS cost_amt_fc,
        CASE 
            WHEN sm.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -sm.actual_billed_quantity
            ELSE sm.actual_billed_quantity
        END AS actual_billed_qty,
        CASE 
            WHEN sm.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -sm."billing_qty_in_PC"
            ELSE sm."billing_qty_in_PC"
        END AS billing_qty_pc,
        CASE 
            WHEN sm.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN -sm.cost_amt
            ELSE sm.cost_amt
        END AS cost_amt_adj,
        CASE 
            WHEN sm.billing_type IN ('ZRE','ZRER','ZRF','ZRR','ZRES') THEN
                CASE 
                    WHEN sm.doc_curr = 'USD' OR sm.sold_to_party = 'NPBI002' THEN -(sm.tax_amt + sm.net_amt)
                    ELSE -sm.net_amt
                END
            ELSE
                CASE 
                    WHEN sm.doc_curr = 'USD' OR sm.sold_to_party = 'NPBI002' THEN sm.tax_amt + sm.net_amt
                    ELSE sm.net_amt
                END
        END AS gross_sales
    FROM size_mapped sm
)
SELECT 
    "Ref Num", "Billing Doc No", "Billing Type", "Sales Org ", "Region",
    "Company Code", "Billing Date", "Sold To Party", "Material Number",
    "Material Desc", "Plant", distribution_channel, "Sales Unit",
    "Business Area", "Profit Center", "Material Type", "Sub Brand (Industry Sec)",
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

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_master_billing_date 
ON lux_staging.sales_master_optimized ("Billing Date");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_master_channel_brand 
ON lux_staging.sales_master_optimized (channel, brand);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_master_material 
ON lux_staging.sales_master_optimized ("Material Number");