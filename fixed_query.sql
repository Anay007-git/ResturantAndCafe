WITH vul_val_data AS (
    SELECT customer_number, sales_org, cust_name, COUNT(customer_number) AS count
    FROM lux_staging.customer_master 
    GROUP BY customer_number, sales_org, cust_name
)
SELECT v.customer_number, v.sales_org, v.cust_name, v.count
FROM vul_val_data v
LEFT JOIN lux_staging.sales_master_finalv9 s ON v.customer_number = s."Sold To Party";