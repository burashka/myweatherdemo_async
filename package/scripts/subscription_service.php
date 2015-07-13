<?php

    require "aps/2/runtime.php";
    require_once("utils.php"); 

    /**
    * @type("http://myweatherdemo.com/async/subscription_service/1.0")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */
    
    class company extends \APS\ResourceBase
    
    {

        /**
         * @link("http://myweatherdemo.com/async/application/1.0")
         * @required
         */
        public $application;
        
        /**
         * @link("http://aps-standard.org/types/core/account/1.0")
         * @required
         */
        public $account;

        /**
         * @link("http://myweatherdemo.com/async/city/1.0[]")
         */
        public $cities;
        
        /**
         * @type(string)
         * @title("Company identifier in MyWeatherDemo")
         */
        public $company_id;

        /**
         * @type(string)
         * @title("Company authorization token")
         */
        public $company_token;

        /**
         * @type(string)
         * @title("Login to MyWeatherDemo interface")
         */
        public $username;

        /**
         * @type(string)
         * @title("Password for MyWeatherDemo user")
         */
        public $password;

        const BASE_URL = "http://www.myweatherdemo.com/api/company/";
        
        public function provision(){
            
            $request = array(
                    'country' => $this->account->addressPostal->countryName,
                    'city' => $this->account->addressPostal->locality,
                    'name' => $this->account->companyName
            );
            
            $response = send_curl_request(true, $this->application->provider_token, 'POST', self::BASE_URL, $request);

            $this->company_id = $response->{'id'};
            $this->company_token = $response->{'token'};
            $this->username = $response->{'username'};
            $this->password = $response->{'password'};

        }

        public function unprovision(){

            $url = self::BASE_URL . $this->company_id;
            $response = send_curl_request(true, $this->application->provider_token, 'DELETE', $url);

        }
    }
?>
