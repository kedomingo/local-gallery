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
        $thumbnail = str_replace(__DIR__, '', getThumbnail($path . '/' . $file) ?? '');

        // Only add if the directory contains images
        if ($file === '..' || $thumbnail !== '') {
            $dirs[] = ['path' => $subpath . '/' . $file, 'thumbnail' => $file === '..' ? 'BACK' : $thumbnail];
        }
    } else {
        $files[] = $subpath . '/' . $file;
    }
}
echo json_encode([
    'dirs' => $dirs,
    'files' => $files,
]);

function getThumbnail(string $dir): ?string
{
    if (preg_match('#/..$#', $dir)) {
        return null;
    }
    $skipped = 0;
    $last = null;

    foreach (scandir($dir) as $file) {
        if (!is_dir($file) && preg_match('/\.jpg$/i', $file)) {
            $last = $dir . '/' . $file;
            if ($skipped++ >= 5) {
                return $dir . '/' . $file;
            }
        }
    }
    // Has image but less than 5
    if ($last !== null) {
        return $last;
    }

    // No image at all, look in the first directory, recursively
    foreach (scandir($dir) as $file) {
        if (is_dir($dir . '/' . $file) && $file !== '.' && $file !== '..') {
            return getThumbnail($dir . '/' . $file);
        }
    }

    return null;
}