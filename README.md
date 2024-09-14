# Jinwen Pan's Academic Website

This website generator is based on the work by Federico Mora Rocha. The original repository can be found at [https://github.com/FedericoAureliano/FedericoAureliano.github.io](https://github.com/FedericoAureliano/FedericoAureliano.github.io). You can see an example of the template in use at Federico's personal website: [https://federico.morarocha.ca/](https://federico.morarocha.ca/).

Feel free to use this website generator for your own academic website. While there's no need to ask for permission or credit the original author on your site, please respect the software license in LICENSE.md.

## Creating Your Website
1. Fill in the ```.json``` files in the ```data``` folder.
2. Run ```python3 build.py``` to build your website.
3. Open ```docs/index.html``` to admire it!

**NOTE**: don't edit ```docs/index.html```, ```docs/news.html```, ```docs/pubs.html```, or ```docs/main.css``` directly. If you want to make structural changes to your  website and you know what you are doing, then edit the build script ```build.py``` or the template files in ```templates/```. 

**NOTE**: after making changes to the ```.json``` files in ```/data```, the template files in ```templates/```, or the build script ```build.py``` remember to run ```python3 build.py``` again for your changes to take effect!

## Hosting Your Website With GitHub Pages
1. In your repo, go to ```settings -> pages``` and set ```source``` to ```/docs```.

**NOTE**: remember to remove or replace ```docs/CNAME```.