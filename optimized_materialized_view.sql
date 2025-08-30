-- Optimized Materialized View using single function
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
        -- Use single function to get channel, brand, and mapped_size
        (lux_staging.get_channel_brand_size(
            s.sales_org, m.material_type, s.billing_type, s.business_area, 
            s.sold_to_party, s.mat_desc, s.material_code, m.material_size, m.old_matl_number
        )).channel AS channel,
        (lux_staging.get_channel_brand_size(
            s.sales_org, m.material_type, s.billing_type, s.business_area, 
            s.sold_to_party, s.mat_desc, s.material_code, m.material_size, m.old_matl_number
        )).brand AS brand,
        (lux_staging.get_channel_brand_size(
            s.sales_org, m.material_type, s.billing_type, s.business_area, 
            s.sold_to_party, s.mat_desc, s.material_code, m.material_size, m.old_matl_number
        )).mapped_size AS mapped_size,
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