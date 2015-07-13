<?php

require_once 'testbase.php';
require_once 'lib/logger.php';

class configure extends \APSTEST\TestBase

{
    public function createApplication($app_id, $endpoint_url, $package_version = null)
    {
        \APSTEST\Logger::info("Creating application instance for application #$app_id with endpoint $endpoint_url");

        $token = $this->getParam('app_defaults');
        $result = $this->createApplicationInstance($app_id, $endpoint_url, $token, $package_version);
        \APSTEST\Logger::info("Application Instance is created. ID: ".$result['app_instance_id']."; APS resource ID: ".$result['app_resource_id']);

        return $result;
    }
    public function createRTs($app_id, $instance)
    {
        $testName = $this->getParam('test_name');

        # Application Service Reference: application
        $RTs[] = $this->createAppServiceRefRT("$testName app", $app_id, $instance['app_resource_id']);

        # Application Service: subscription_service and city
        $RTs[] = $this->createAppServiceRT("$testName company", $app_id, "subscription_service", 1);
        $RTs[] = $this->createAppServiceRT("$testName city", $app_id, "city", 0, 10);

        return $RTs;
    }
}
