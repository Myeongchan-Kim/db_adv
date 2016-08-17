
table "country" do
	column "country_code", :string
	column "region", :string
	column "income_group", :string
	column "special_notes", :text
	column "country_name", :string
end

table "agriculture_rural_development_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "aid_effectiveness_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "climate_change_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end


table "economy_growth_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "education_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "energy_mining_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "environment_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "external_debt_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "financial_sector_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "gender_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "health_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "indicator" do
	column "indicator_code", :string
	column "topic", :string
	column "name", :string
	column "long_definition", :text
	column "limitations_exceptions", :text
	column "source", :text
	column "statistical_concept_methodology", :text
	column "development_relevance", :text
end

table "infrastructure_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "poverty_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "private_sector_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "public_sector_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "science_technology_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "social_development_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "social_protection_labor_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "trade" do
	column "country_name", :string
	column "country_code", :string
	column "indicator_name", :string
	column "indicator_code", :string
	column "year_1960", :decimal
	column "year_1961", :decimal
	column "year_1962", :decimal
	column "year_1963", :decimal
	column "year_1964", :decimal
	column "year_1965", :decimal
	column "year_1966", :decimal
	column "year_1967", :decimal
	column "year_1968", :decimal
	column "year_1969", :decimal
	column "year_1970", :decimal
	column "year_1971", :decimal
	column "year_1972", :decimal
	column "year_1973", :decimal
	column "year_1974", :decimal
	column "year_1975", :decimal
	column "year_1976", :decimal
	column "year_1977", :decimal
	column "year_1978", :decimal
	column "year_1979", :decimal
	column "year_1980", :decimal
	column "year_1981", :decimal
	column "year_1982", :decimal
	column "year_1983", :decimal
	column "year_1984", :decimal
	column "year_1985", :decimal
	column "year_1986", :decimal
	column "year_1987", :decimal
	column "year_1988", :decimal
	column "year_1989", :decimal
	column "year_1990", :decimal
	column "year_1991", :decimal
	column "year_1992", :decimal
	column "year_1993", :decimal
	column "year_1994", :decimal
	column "year_1995", :decimal
	column "year_1996", :decimal
	column "year_1997", :decimal
	column "year_1998", :decimal
	column "year_1999", :decimal
	column "year_2000", :decimal
	column "year_2001", :decimal
	column "year_2002", :decimal
	column "year_2003", :decimal
	column "year_2004", :decimal
	column "year_2005", :decimal
	column "year_2006", :decimal
	column "year_2007", :decimal
	column "year_2008", :decimal
	column "year_2009", :decimal
	column "year_2010", :decimal
	column "year_2011", :decimal
	column "year_2012", :decimal
	column "year_2013", :decimal
	column "year_2014", :decimal
	column "year_2015", :decimal
	column "id", :key, :as => :integer
end

table "trade_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

table "urban_development" do
	column "country_name", :string
	column "country_code", :string
	column "indicator_name", :string
	column "indicator_code", :string
	column "year_1960", :decimal
	column "year_1961", :decimal
	column "year_1962", :decimal
	column "year_1963", :decimal
	column "year_1964", :decimal
	column "year_1965", :decimal
	column "year_1966", :decimal
	column "year_1967", :decimal
	column "year_1968", :decimal
	column "year_1969", :decimal
	column "year_1970", :decimal
	column "year_1971", :decimal
	column "year_1972", :decimal
	column "year_1973", :decimal
	column "year_1974", :decimal
	column "year_1975", :decimal
	column "year_1976", :decimal
	column "year_1977", :decimal
	column "year_1978", :decimal
	column "year_1979", :decimal
	column "year_1980", :decimal
	column "year_1981", :decimal
	column "year_1982", :decimal
	column "year_1983", :decimal
	column "year_1984", :decimal
	column "year_1985", :decimal
	column "year_1986", :decimal
	column "year_1987", :decimal
	column "year_1988", :decimal
	column "year_1989", :decimal
	column "year_1990", :decimal
	column "year_1991", :decimal
	column "year_1992", :decimal
	column "year_1993", :decimal
	column "year_1994", :decimal
	column "year_1995", :decimal
	column "year_1996", :decimal
	column "year_1997", :decimal
	column "year_1998", :decimal
	column "year_1999", :decimal
	column "year_2000", :decimal
	column "year_2001", :decimal
	column "year_2002", :decimal
	column "year_2003", :decimal
	column "year_2004", :decimal
	column "year_2005", :decimal
	column "year_2006", :decimal
	column "year_2007", :decimal
	column "year_2008", :decimal
	column "year_2009", :decimal
	column "year_2010", :decimal
	column "year_2011", :decimal
	column "year_2012", :decimal
	column "year_2013", :decimal
	column "year_2014", :decimal
	column "year_2015", :decimal
	column "id", :key, :as => :integer
end

table "urban_development_new" do
	column "id", :key, :as => :integer
	column "country_code", :string
	column "indicator_code", :string
	column "year", :integer
	column "value", :decimal
end

