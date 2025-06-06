-- CreateEnum
CREATE TYPE "currency_enum" AS ENUM ('EUR', 'RON', 'USD');

-- CreateEnum
CREATE TYPE "heating_type_enum" AS ENUM ('CENTRAL_HEATING', 'OWN_GAS_HEATING', 'ELECTRIC', 'WOOD_STOVE', 'DISTRICT_HEATING', 'NONE', 'OTHER');

-- CreateEnum
CREATE TYPE "property_status_enum" AS ENUM ('AVAILABLE', 'SOLD', 'RENTED', 'PENDING', 'UNAVAILABLE', 'DRAFT');

-- CreateEnum
CREATE TYPE "property_type_enum" AS ENUM ('APARTMENT', 'HOUSE', 'LAND', 'OTHER_PROPERTY');

-- CreateEnum
CREATE TYPE "seller_type_enum" AS ENUM ('OWNER', 'AGENT', 'DEVELOPER');

-- CreateTable
CREATE TABLE "apartment_details" (
    "property_id" UUID NOT NULL,
    "apartment_type_scraped" VARCHAR(255),
    "floor_number_scraped" VARCHAR(100),
    "floor_number_parsed" INTEGER,
    "total_floors_in_building" INTEGER,
    "building_type_scraped" VARCHAR(255),
    "heating_system_scraped" VARCHAR(255),
    "is_furnished_scraped" VARCHAR(100),
    "has_balcony" BOOLEAN,
    "has_elevator" BOOLEAN,
    "additional_information_scraped" TEXT,

    CONSTRAINT "apartment_details_pkey" PRIMARY KEY ("property_id")
);

-- CreateTable
CREATE TABLE "countries" (
    "country_id" SERIAL NOT NULL,
    "country_name" VARCHAR(255) NOT NULL,
    "iso_alpha2_code" CHAR(2),
    "iso_alpha3_code" CHAR(3),
    "region" VARCHAR(100),
    "sub_region" VARCHAR(100),

    CONSTRAINT "countries_pkey" PRIMARY KEY ("country_id")
);

-- CreateTable
CREATE TABLE "country_macroeconomic_data" (
    "data_id" SERIAL NOT NULL,
    "country_id" INTEGER NOT NULL,
    "factor_type_id" INTEGER NOT NULL,
    "data_date" DATE NOT NULL,
    "value" DECIMAL(20,5),
    "date_recorded" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "country_macroeconomic_data_pkey" PRIMARY KEY ("data_id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "facility_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("facility_id")
);

-- CreateTable
CREATE TABLE "facility_types" (
    "facility_type_id" SERIAL NOT NULL,
    "facility_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "facility_types_pkey" PRIMARY KEY ("facility_type_id")
);

-- CreateTable
CREATE TABLE "features_and_amenities" (
    "feature_id" SERIAL NOT NULL,
    "feature_name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),

    CONSTRAINT "features_and_amenities_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "house_details" (
    "property_id" UUID NOT NULL,
    "house_type_scraped" VARCHAR(255),
    "floors_scraped" VARCHAR(100),
    "heating_system_scraped" VARCHAR(255),
    "land_surface_area" DECIMAL(10,2),
    "construction_material_scraped" VARCHAR(255),
    "has_garden_bool" BOOLEAN,
    "has_pool_bool" BOOLEAN,
    "has_garage_bool" BOOLEAN,
    "additional_information_scraped" TEXT,

    CONSTRAINT "house_details_pkey" PRIMARY KEY ("property_id")
);

-- CreateTable
CREATE TABLE "macroeconomic_factor_types" (
    "factor_type_id" SERIAL NOT NULL,
    "factor_name" VARCHAR(255) NOT NULL,
    "factor_description" TEXT,
    "unit" VARCHAR(50),
    "data_source" VARCHAR(255),
    "frequency" VARCHAR(50),

    CONSTRAINT "macroeconomic_factor_types_pkey" PRIMARY KEY ("factor_type_id")
);

-- CreateTable
CREATE TABLE "ml_price_predictions" (
    "prediction_id" SERIAL NOT NULL,
    "property_id" UUID NOT NULL,
    "model_version" VARCHAR(100) NOT NULL,
    "predicted_price" DECIMAL(14,2) NOT NULL,
    "prediction_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "confidence_score" DECIMAL(5,4),
    "feature_importance" JSONB,

    CONSTRAINT "ml_price_predictions_pkey" PRIMARY KEY ("prediction_id")
);

-- CreateTable
CREATE TABLE "properties" (
    "internal_property_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_listing_id" VARCHAR(255) NOT NULL,
    "source_name" VARCHAR(100) NOT NULL DEFAULT 'storia.ro',
    "source_url" TEXT,
    "country_id" INTEGER,
    "listing_type" VARCHAR(50) DEFAULT 'SALE',
    "property_category" VARCHAR(100),
    "title" TEXT,
    "price" DECIMAL(14,2),
    "currency" VARCHAR(10) DEFAULT 'EUR',
    "price_per_sqm" DECIMAL(10,2),
    "rent_price" DECIMAL(10,2),
    "address_text" TEXT,
    "city" VARCHAR(255),
    "county" VARCHAR(255),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "total_surface_area" DECIMAL(10,2),
    "number_of_rooms" INTEGER,
    "construction_year" INTEGER,
    "property_condition_scraped" VARCHAR(255),
    "advertiser_type_scraped" VARCHAR(100),
    "availability_date" DATE,
    "property_form_scraped" VARCHAR(255),
    "is_new_building_bool" BOOLEAN,
    "distance_to_school_meters" INTEGER,
    "has_school_nearby_bool" BOOLEAN,
    "distance_to_park_meters" INTEGER,
    "has_park_nearby_bool" BOOLEAN,
    "distance_to_transport_meters" INTEGER,
    "has_transport_nearby_bool" BOOLEAN,
    "distance_to_supermarket_meters" INTEGER,
    "has_supermarket_nearby_bool" BOOLEAN,
    "distance_to_hospital_meters" INTEGER,
    "has_hospital_nearby_bool" BOOLEAN,
    "distance_to_restaurant_meters" INTEGER,
    "has_restaurant_nearby_bool" BOOLEAN,
    "distance_to_gym_meters" INTEGER,
    "has_gym_nearby_bool" BOOLEAN,
    "distance_to_mall_meters" INTEGER,
    "has_mall_nearby_bool" BOOLEAN,
    "accessibility_score" DECIMAL(5,2),
    "facility_count" INTEGER,
    "accessibility_label" VARCHAR(100),
    "image_count" INTEGER DEFAULT 0,
    "date_scraped" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "date_last_scraped" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_active_on_source" BOOLEAN DEFAULT true,
    "raw_scraped_fields" JSONB,
    "date_created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_modified_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("internal_property_id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "image_id" SERIAL NOT NULL,
    "property_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "s3_bucket" VARCHAR(255),
    "s3_key" TEXT,
    "is_primary" BOOLEAN DEFAULT false,
    "sort_order" INTEGER DEFAULT 0,
    "date_added" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "property_nearby_facilities" (
    "property_id" UUID NOT NULL,
    "facility_id" INTEGER NOT NULL,
    "distance_meters" INTEGER,

    CONSTRAINT "property_nearby_facilities_pkey" PRIMARY KEY ("property_id","facility_id")
);

-- CreateTable
CREATE TABLE "property_to_feature_link" (
    "property_id" UUID NOT NULL,
    "feature_id" INTEGER NOT NULL,

    CONSTRAINT "property_to_feature_link_pkey" PRIMARY KEY ("property_id","feature_id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "user_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "favorited_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("user_id","property_id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "auth_provider_id" VARCHAR(255),
    "username" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone_number" VARCHAR(50),
    "profile_picture_url" TEXT,
    "date_registered" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ(6),

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_saved_listings" (
    "saved_listing_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "date_saved" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "user_saved_listings_pkey" PRIMARY KEY ("saved_listing_id")
);

-- CreateTable
CREATE TABLE "user_search_history" (
    "search_id" SERIAL NOT NULL,
    "user_id" UUID,
    "search_query_text" TEXT,
    "search_filters" JSONB,
    "search_timestamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "result_count" INTEGER,

    CONSTRAINT "user_search_history_pkey" PRIMARY KEY ("search_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone_number" VARCHAR(20),
    "user_type" VARCHAR(50) DEFAULT 'standard',
    "profile_picture_url" TEXT,
    "is_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_country_name_key" ON "countries"("country_name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso_alpha2_code_key" ON "countries"("iso_alpha2_code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso_alpha3_code_key" ON "countries"("iso_alpha3_code");

-- CreateIndex
CREATE UNIQUE INDEX "country_macroeconomic_data_country_id_factor_type_id_data_d_key" ON "country_macroeconomic_data"("country_id", "factor_type_id", "data_date");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_name_key" ON "facilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "facility_types_facility_name_key" ON "facility_types"("facility_name");

-- CreateIndex
CREATE UNIQUE INDEX "features_and_amenities_feature_name_key" ON "features_and_amenities"("feature_name");

-- CreateIndex
CREATE UNIQUE INDEX "macroeconomic_factor_types_factor_name_key" ON "macroeconomic_factor_types"("factor_name");

-- CreateIndex
CREATE UNIQUE INDEX "properties_source_url_key" ON "properties"("source_url");

-- CreateIndex
CREATE INDEX "idx_properties_category" ON "properties"("property_category");

-- CreateIndex
CREATE INDEX "idx_properties_city_county" ON "properties"("city", "county");

-- CreateIndex
CREATE INDEX "idx_properties_location" ON "properties"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "idx_properties_price" ON "properties"("price");

-- CreateIndex
CREATE INDEX "idx_properties_source_url" ON "properties"("source_url");

-- CreateIndex
CREATE UNIQUE INDEX "properties_source_listing_id_source_name_key" ON "properties"("source_listing_id", "source_name");

-- CreateIndex
CREATE INDEX "idx_property_images_property_id" ON "property_images"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "property_images_property_id_image_url_key" ON "property_images"("property_id", "image_url");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_auth_provider_id_key" ON "user_profiles"("auth_provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_username_key" ON "user_profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_saved_listings_user_id_property_id_key" ON "user_saved_listings"("user_id", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "apartment_details" ADD CONSTRAINT "apartment_details_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("internal_property_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "country_macroeconomic_data" ADD CONSTRAINT "country_macroeconomic_data_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "country_macroeconomic_data" ADD CONSTRAINT "country_macroeconomic_data_factor_type_id_fkey" FOREIGN KEY ("factor_type_id") REFERENCES "macroeconomic_factor_types"("factor_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "house_details" ADD CONSTRAINT "house_details_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("internal_property_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ml_price_predictions" ADD CONSTRAINT "ml_price_predictions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("internal_property_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("internal_property_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_nearby_facilities" ADD CONSTRAINT "property_nearby_facilities_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("facility_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_nearby_facilities" ADD CONSTRAINT "property_nearby_facilities_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("internal_property_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_to_feature_link" ADD CONSTRAINT "property_to_feature_link_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features_and_amenities"("feature_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_to_feature_link" ADD CONSTRAINT "property_to_feature_link_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("internal_property_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_saved_listings" ADD CONSTRAINT "user_saved_listings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("internal_property_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_saved_listings" ADD CONSTRAINT "user_saved_listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_search_history" ADD CONSTRAINT "user_search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

