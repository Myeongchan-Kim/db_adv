
table "indicator" do
	column "indicator_code", :key, :as => :string
	column "topic", :string
	column "name", :string
	column "long_definition", :text
	column "limitations_exceptions", :text
	column "source", :text
	column "statistical_concept_methodology", :text
	column "development_relevance", :text
end

table "country" do
	column "country_code", :key, :as => :string
	column "region", :string
	column "income_group", :string
	column "special_notes", :text
	column "country_name", :string
end

table "agriculture_rural_development_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "aid_effectiveness_new" do
	column "id", :key, :as => :integer
	column "country_code", :string,   :references => "country"
	column "indicator_code", :string ,   :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "climate_change_new" do
	column "id", :key, :as => :integer
	column "country_code", :string,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end


table "economy_growth_new" do
	column "id", :key, :as => :integer
	column "country_code", :string,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "education_new" do
	column "id", :key, :as => :integer
	column "country_code", :string,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "energy_mining_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "environment_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "external_debt_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "financial_sector_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "gender_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "health_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "infrastructure_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "poverty_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "private_sector_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "public_sector_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "science_technology_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "social_development_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

table "social_protection_labor_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end
table "trade_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end


table "urban_development_new" do
	column "id", :key, :as => :integer
	column "country_code", :string ,   :references => "country"
	column "indicator_code", :string , :references => "indicator"
	column "year", :integer
	column "value", :decimal
end

