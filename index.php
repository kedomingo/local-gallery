<?php
header('Access-Control-Allow-Origin: *');

# Serve content

$path = realpath(__DIR__ . '/' . ltrim(urldecode($_GET['path'] ?? ''), '/'));
$subpath = str_replace(__DIR__, '', $path);

$files = [];
$dirs = [];

foreach (scandir($path) as $file) {
    if ($file === '.') {
        continue;
    }
    if (is_dir($path . '/' . $file)) {
        $dirs[] = $subpath . '/' . $file;
    } else {
        $files[] = $subpath . '/' . $file;
    }
}
echo json_encode([
    'dirs' => $dirs,
    'files' => $files,
]);
