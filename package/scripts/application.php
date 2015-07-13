<?php
    require "aps/2/runtime.php";    

    /**
    * @type("http://myweatherdemo.com/async/application/1.0")
    * @implements("http://aps-standard.org/types/core/application/1.0")
    */

    class app extends \APS\ResourceBase
    
    {
        /**
         * @link("http://myweatherdemo.com/async/subscription_service/1.0[]")
         */
        public $subscription_service;
        
        /**
         * @type(string)
         * @title("Token")
         * @encrypted
         */
        public $provider_token;          
    }
?>
