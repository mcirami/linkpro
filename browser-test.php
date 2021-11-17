<?php

require_once( 'vendor/autoload.php' );

use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\WebDriverBy;

use BrowserStack\Local;

$bs_local = new Local();
$bs_local_args = array("key" => "2ui2MZXVveUjjpUSK3Xi");
$bs_local->start($bs_local_args);
echo $bs_local->isRunning();


function executeTestCase( $caps ) {

    $caps = array(
        $username = getenv("BROWSERSTACK_USERNAME"),
        $accessKey = getenv("BROWSERSTACK_ACCESS_KEY"),
    );

    $web_driver = RemoteWebDriver::create(
        "https://" .$username . ":" . $accessKey . "@hub-cloud.browserstack.com/wd/hub",
        $caps
    );
    # Searching for 'BrowserStack' on google.com
    $web_driver->get( "http://0.0.0.0/" );
    $element = $web_driver->findElement( WebDriverBy::name( "q" ) );
    if ( $element ) {
        $element->sendKeys( "BrowserStack" );
        $element->submit();
    }
    print $web_driver->getTitle();
    # Setting the status of test as 'passed' or 'failed' based on the condition; if title of the web page starts with 'BrowserStack'
    if ( substr( $web_driver->getTitle(), 0, 12 ) == "BrowserStack" ) {
        $web_driver->executeScript( 'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed", "reason": "Yaay! Title matched!"}}' );
    } else {
        $web_driver->executeScript( 'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed", "reason": "Oops! Title did not match!"}}' );
    }
    $web_driver->quit();
}

$caps = array(
    array(
        "browserName" => "android",
        "realMobile"  => "true",
        "device"      => "OnePlus 9",
        "os_version"  => "11.0",
        "build"       => "browserstack-build-1",
        "name"        => "Parallel test 1",
        "browserstack.local" => "true",
        "browserstack.debug" => "true",
        "browserstack.networkLogs" => "true",
        "browserstack.networkProfile" => "no-network"
    ),
    array(
        "browserName" => "android",
        "realMobile"  => "true",
        "device"      => "Google Pixel 5",
        "os_version"  => "12.0",
        "build"       => "browserstack-build-1",
        "name"        => "Parallel test 2",
        "browserstack.local" => "true",
        "browserstack.debug" => "true",
        "browserstack.networkLogs" => "true",
        "browserstack.networkProfile" => "no-network"
    ),
    array(
        "browserName" => "android",
        "realMobile"  => "true",
        "device"      => "Google Nexus 6",
        "os_version"  => "6.0",
        "build"       => "browserstack-build-1",
        "name"        => "Parallel test 3",
        "browserstack.local" => "true",
        "browserstack.debug" => "true",
        "browserstack.networkLogs" => "true",
        "browserstack.networkProfile" => "no-network"
    )
);
foreach ( $caps as $cap ) {
    executeTestCase( $cap );
}

$bs_local->stop();
