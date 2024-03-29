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
    } elseif (preg_match('/\.jpg/i', $file)) {
        $files[] = $subpath . '/' . $file;
    }
}

// Fix alphabetical sort of files to consider number suffix
usort($dirs, function (array $a, array $b) {
    // Prefixed
    if (preg_match('/-(\d+)$/', $a['path'], $match1)
     && preg_match('/-(\d+)$/', $b['path'], $match2)){
        return $match1[1] - $match2[1];
    }
    // Only numbers
    if (preg_match('/\/(\d+)$/', $a['path'], $match1)
     && preg_match('/\/(\d+)$/', $b['path'], $match2)){
        return $match1[1] - $match2[1];
    }
    return strcmp($a['path'], $b['path']);
});

usort($files, function (string $a, string $b) {
    if (preg_match('/-(\d+)\.jpg$/', $a, $match1)
     && preg_match('/-(\d+)\.jpg$/', $b, $match2)){
        return $match1[1] - $match2[1];
    }
    return strcmp($a, $b);
});

echo json_encode([
    'dirs' => $dirs,
    'files' => $files,
]);

function getThumbnail(string $dir): ?string
{
    if (preg_match('#/\.\.$#', $dir)) {
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