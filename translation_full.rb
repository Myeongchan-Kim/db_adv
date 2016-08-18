
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
