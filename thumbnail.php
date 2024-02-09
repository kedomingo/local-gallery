<?php
ini_set('memory_limit', '1G');
header('Access-Control-Allow-Origin: *');

if (!file_exists(__DIR__.'/vendor/autoload.php')) {
    return;
}

require_once __DIR__.'/vendor/autoload.php';

$path = realpath(__DIR__ . '/' . ltrim(urldecode($_GET['path'] ?? ''), '/'));

if (!is_file($path)) {
    return;
}

// import the Intervention Image Manager Class
use Intervention\Image\ImageManager;

// create an image manager instance with favored driver
$manager = new ImageManager();

// to finally create image instances
$image = $manager->make($path)->fit(100, 100);

header('Cache-Control: max-age=604800');
echo $image->response('jpg', 70);


