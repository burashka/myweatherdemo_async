<?php

    define('APS_DEVELOPMENT_MODE', true);
    require "aps/2/runtime.php";
    require_once("utils.php");

    /**
    * @type("http://myweatherdemo.com/async/city/1.0")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */

    class app extends \APS\ResourceBase
    
    {
        /**
         * @link("http://myweatherdemo.com/async/subscription_service/1.0")
         * @required
         */
        public $subscription_service;
        
        /**
         * @type(string)
         * @title("City")
         */
        public $city;

        /**
         * @type(string)
         * @title("Country")
         */
        public $country;

        /**
         * @type(string)
         * @title("Description")
         */
        public $description;

        /**
         * @type(string)
         * @title("Units")
         */
        public $units;

        /**
         * @type(boolean)
         * @title("Show Humidity")
         */
        public $include_humidity;

        /**
         * @type(string)
         * @title("Units")
         */
        public $external_city_id;

        /**
         * @type(string)
         * @title("Status")
         */
        public $status;

        // MyWeatherDemo API URL
        const BASE_URL = "http://www.myweatherdemo.com/api/";

        public function provision(){
            
            // to create a watchcity in external service we need to pass country, city and companyid
            // the rest is optional for API call in MyWeatherDemo but we still need to pass user's selection from UI
            $request = array(
                    'country' => $this->country,
                    'city' => $this->city,
                    'companyid' => $this->subscription_service->company_id,
                    'description' => $this->description,
                    'units' => $this->units,
                    'includeHumidity' => $this->include_humidity
            );
            
            $response = send_curl_request(false, $this->subscription_service->company_token, 'POST', self::BASE_URL . 'watchcityasync/', $request);

            $this->external_city_id = $response->{'id'};

            $this->status = "provisioning";
            throw new \Rest\Accepted($this, "Creating a city subscription..", 30);
        }

        public function provisionAsync(){
            $url = self::BASE_URL . 'watchcityasync/' . $this->external_city_id;
            $response = send_curl_request(false, $this->subscription_service->company_token, 'GET', $url);

            switch ($response->status){
                case "provisioning":
                    throw new \Rest\Accepted($this, "Still creating a city subscription", 30);
                    break;
                case "provisioning_failed":
                    throw new Exception("Internal Server Error: could not create a subcription to a service, try later.");
                    break;
                case "country_not_found":
                    $this->status = "country_not_found";
                    break;
                case "provisioned":
                    $this->status = "provisioned";
                    break;
            }
        }

        public function configure($new){

            $url = self::BASE_URL . 'watchcity/' . $this->external_city_id;

            // we are updating only these three properties since only they can be changed in UI
            $request = array(
                    'companyid' => $this->subscription_service->company_id,
                    'description' => $new->description,
                    'units' => $new->units,
                    'includeHumidity' => $new->include_humidity
            );

            $response = send_curl_request(false, $this->subscription_service->company_token, 'PUT', $url, $request);
        }

        public function unprovision(){

            $url = self::BASE_URL . 'watchcity/' . $this->external_city_id;
            $response = send_curl_request(false, $this->subscription_service->company_token, 'DELETE', $url);
            
        }
    }
?>
