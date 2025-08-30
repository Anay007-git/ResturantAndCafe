-- Insert size mapping data
INSERT INTO lux_config.size_mappings (original_size, mapped_size_kids, mapped_size_adult) VALUES
('025', '25', 'XS/75'),
('030', '30', 'XS/75'),
('035', '35', 'S/80'),
('040', '40', 'XXL/100'),
('045', '45', 'XL/95'),
('050', '50', 'FREE SIZE'),
('055', '55', 'FREE SIZE'),
('060', '60', 'FREE SIZE'),
('065', '65', 'FREE SIZE'),
('070', '70', 'FREE SIZE'),
('073', '73', 'FREE SIZE'),
('075', 'XS/75', 'XS/75'),
('080', 'S/80', 'S/80'),
('085', 'M/85', 'M/85'),
('090', 'L/90', 'L/90'),
('095', 'XL/95', 'XL/95'),
('100', 'XXL/100', 'XXL/100'),
('105', '3XL/105', '3XL/105'),
('110', '4XL/110', '4XL/110'),
('115', '5XL/115', '5XL/115'),
('120', 'FREE SIZE', '6XL/120'),
('00S', 'S/80', 'S/80'),
('00M', 'M/85', 'M/85'),
('00L', 'L/90', 'L/90'),
('0XL', 'XL/95', 'XL/95'),
('0XS', 'XS/75', 'XS/75'),
('XXL', 'XXL/100', 'XXL/100'),
('2XL', 'XXL/100', 'XXL/100'),
('3XL', '3XL/105', '3XL/105'),
('4XL', '4XL/110', '4XL/110'),
('5XL', '5XL/115', '5XL/115'),
('6XL', 'FREE SIZE', '6XL/120'),
('SXL', '5XL/115', '5XL/115'),
('032', 'S/80', 'S/80'),
('034', 'M/85', 'M/85'),
('036', 'L/90', 'L/90'),
('038', 'XL/95', 'XL/95'),
('042', '3XL/105', '3XL/105'),
('044', '4XL/110', '4XL/110'),
('046', '5XL/115', '5XL/115'),
('048', 'FREE SIZE', '6XL/120')
ON CONFLICT (original_size) DO UPDATE SET
    mapped_size_kids = EXCLUDED.mapped_size_kids,
    mapped_size_adult = EXCLUDED.mapped_size_adult;

-- Insert business area configurations
INSERT INTO lux_config.business_areas (business_area, category) VALUES
('LI29', 'ecom'), ('LI42', 'ecom'), ('LI43', 'ecom'), ('LI44', 'ecom'),
('LI45', 'ecom'), ('LI46', 'ecom'), ('LI47', 'ecom'), ('LI48', 'ecom'),
('LI49', 'ecom'), ('LI50', 'ecom'), ('LI51', 'ecom'), ('LI52', 'ecom'),
('LI53', 'ecom'), ('LI54', 'ecom'), ('LI55', 'ecom'), ('LI56', 'ecom'),
('LI70', 'ecom'), ('LI28', 'ebo'), ('LI80', 'ebo'),
('LI26', 'excluded'), ('LI38', 'excluded')
ON CONFLICT (business_area) DO UPDATE SET category = EXCLUDED.category;

-- Insert sales org configurations  
INSERT INTO lux_config.sales_orgs (sales_org, org_type) VALUES
('LI05', 'domestic'), ('3000', 'lfs'), ('AR01', 'lfs'), ('AS01', 'lfs'),
('EB01', 'lfs'), ('JM01', 'lfs'), ('JM02', 'lfs'), ('JM03', 'lfs'),
('JT01', 'lfs'), ('LC01', 'lfs'), ('LC02', 'lfs'), ('LC03', 'lfs'),
('LC04', 'lfs'), ('LC05', 'lfs'), ('LC06', 'lfs'), ('LI01', 'domestic'),
('LI02', 'domestic'), ('LI03', 'domestic'), ('LI04', 'export'),
('LI06', 'domestic'), ('LI07', 'domestic'), ('LI09', 'domestic'),
('LI10', 'domestic'), ('LX01', 'lfs'), ('LX02', 'lfs'), ('LX03', 'lfs'),
('LX04', 'lfs'), ('ON01', 'lfs')
ON CONFLICT (sales_org) DO UPDATE SET org_type = EXCLUDED.org_type;