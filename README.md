This is created using NextJS and is meant as a quick coding solution for me to view photos in my mac from my tablet to
show around.

This is composed of 2 parts: a PHP backend script that you put in the root of your photos directory; and this frontend
application

## Setup

### Determine your machine's IP address

Run `ifconfig` to determine your machine's IP address

### PHP

1. Install PHP
2. Put the `index.php` file to the folder where your photos reside
3. start the built-in PHP server and use the IP address from the previous step. For example if your IP
   is `192.168.0.145` then run `php -S 192.168.0.145:8080`

<img width="701" alt="Screenshot 2024-02-09 at 20 40 54" src="https://github.com/kedomingo/local-gallery/assets/1763107/d28e79f3-4469-467b-bc2d-90c20c3c33c8">


### Nodejs

1. Update the IP address with your machine's IP in `constants.ts` 
2. Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
3. Install nodejs 18 using nvm: `nvm install 18` then `nvm use 18`
4. Install yarn for nodejs 18:  `npm install --global yarn`
5. Install dependencies then start the nextjs server: `yarn` then `yarn dev`

<img width="417" alt="Screenshot 2024-02-09 at 20 41 09" src="https://github.com/kedomingo/local-gallery/assets/1763107/5caf27ef-f3e2-4035-86a8-018b06a21f1a">


### Viewing photos in another device

Make sure your device is in the same local network as your image server. Access your server using the IP address at port 3000.

Click on the directory names to navigate. Click on the first link (ending in `/..`) to go up one directory level.

![Screenshot_20240209_204356_org mozilla firefox](https://github.com/kedomingo/local-gallery/assets/1763107/43fef4ff-8ce6-41d2-8c67-8e4f435669ea)


**Click on the Open Gallery link to open the lightbox. Swipe images and pinch to zoom.**

![Screenshot_20240209_204431_org mozilla firefox](https://github.com/kedomingo/local-gallery/assets/1763107/85e76eec-7fba-4719-afd6-eac67e5500a3)



### Limitations

Because the images in the server do not have thumbnails, rendering all of them in small format is the same as downloading them in full.
This takes a very long time if your folders have hundreds of images (because the PHP server we are using is very primitive).

Because of this, we avoid displaying all photos at once and instead implement a moving window approach where only
10 images are loaded at one time. That is, if you get to the 6th image, then the current images loaded in the frontend
are only images #2 - #11.
