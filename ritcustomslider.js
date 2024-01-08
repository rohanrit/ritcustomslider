
  "use strict";

  function createImageSlider(target = "", csvfile = null, options = {}) {
    const slslides = options.slides || 3;
    const sldirection = options.direction || "right";
    const slspeed = options.speed || 3000;
    const slarrowbg = options.arrowbg || "#000";
    const slthumb = options.thumb || "";
    const slratio = options.aspectratio || 56.25;
    const sltelem = "rslider";

    function genANCode(length) {
      let result = "r";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    function parseCSV(csvData) {
      const rows = csvData.split("\n");
      const result = rows.map((row) => row.split(","));
      return result;
    }

    function fetchCSVData(url) {
      return new Promise((resolve, reject) => {
        fetch(url)
          .then((response) => response.text())
          .then((csvData) => {
            const parsedData = parseCSV(csvData);
            return parsedData;
          })
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    function csvToJson(csvData) {
      csvData.pop();
      const csvArray = csvData.slice("\n");
      const jsonKeys = csvArray[0].slice(",").map((key) => key.trim());
      csvArray.shift();
      const jsonArray = csvArray.map((csvRowString) => {
        const newObj = {};
        csvRowString.slice(",").forEach((val, i) => {
          newObj[jsonKeys[i]] = val.trim();
        });
        return newObj;
      });
      return jsonArray;
    }

    function dataToDom(objarr, parentcontainer) {
      let slideratio = 100 / slslides;
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      const parentContainerWidth = parentcontainer.offsetWidth;
      let itemwidth = parentContainerWidth;
      if (width > 480 && width <= 980) {
        itemwidth = parentContainerWidth / Math.round(slslides / 3);
      } else if (width > 980 && width <= 1366) {
        itemwidth = parentContainerWidth / Math.round(slslides / 2);
      } else if (width > 1366) {
        itemwidth = parentContainerWidth / slslides;
      }
      let itemheight = (itemwidth * slratio) / 100;
      const currslid = genANCode(5);

      let htmldom = `<div id="${currslid}" class="${sltelem}" style="position: relative;overflow: hidden;box-sizing: border-box;z-index:0;"><div class="${sltelem}__wrapper" style="position: relative;margin: 0;padding: 0;width: 100%;height: 100%;display: flex;transform: translateX(-0}%);box-sizing: border-box;z-index:1;">${objarr
        .map((item, i) => {
          let ecnodedsrc = String(item.src);
          if (item.type === "video") {
            return `<div class="${sltelem}__item" style="position: relative;min-width: ${itemwidth}px;min-height: ${itemheight}px;box-sizing: border-box;overflow: hidden;"><div id="${sltelem}__item__${currslid}-${i}" class="box-wrapper" style="position:absolute;top:0;left:0;right:0;bottom:0;margin: 0;height: 100%;width: 100%;"><button type="button" data-type="${
              item.type
            }" data-src="${encodeURIComponent(ecnodedsrc)}" data-thumb="${
              item.poster
            }" data-ratio="${slratio}" title="${
              item.title
            }" style="display: flex;align-items: center;justify-content: center;width:100%;height: 100%;background:transparent;border:none;cursor:pointer;margin:0;padding:0;"><img class="img-fluid full-width lazy-load-media" src="${slthumb}" data-src="${
              item.poster
            }" alt="${
              item.alt
            }" style="height: auto;width: 100%;object-fit: cover;"><div class="box-btnwrap" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ffffff" class="bi bi-play-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"></path></svg></div></button></div></div>`;
          } else if (item.type === "embed") {
            return `<div class="${sltelem}__item" style="position: relative;min-width: ${itemwidth}px;min-height: ${itemheight}px;box-sizing: border-box;overflow: hidden;"><div id="${sltelem}__item__${currslid}-${i}" class="box-wrapper" style="position:absolute;top:0;left:0;right:0;bottom:0;margin: 0;height: 100%;width: 100%;"><button type="button" data-type="${
              item.type
            }" data-src="${encodeURIComponent(ecnodedsrc)}" data-thumb="${
              item.poster
            }" data-ratio="${slratio}" title="${
              item.title
            }" style="display: flex;align-items: center;justify-content: center;width:100%;height:100%;background:transparent;border:none;cursor:pointer;margin:0;padding:0;"><img class="img-fluid full-width lazy-load-media" src="${slthumb}" data-src="${
              item.poster
            }" alt="${
              item.alt
            }" style="height: auto;width: 100%;object-fit: cover;"><div class="box-btnwrap" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ffffff" class="bi bi-play-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"></path></svg></div></button></div></div>`;
          } else {
            return `<div class="${sltelem}__item" style="position: relative;min-width: ${itemwidth}px;min-height: ${itemheight}px;box-sizing: border-box;overflow: hidden;"><div id="${sltelem}__item__${currslid}-${i}" class="box-wrapper" style="position:absolute;top:0;left:0;right:0;bottom:0;margin: 0;height: 100%;width: 100%;"><a href="${item.url}" title="${item.title}" target="_blank" style="display: flex;align-items: center;justify-content: center;width:100%;height: 100%;"><img class="img-fluid full-width lazy-load-media" src="${slthumb}" data-src="${ecnodedsrc}" alt="${item.alt}" style="height: auto;width: 100%;object-fit: cover;"></a></div></div>`;
          }
        })
        .join(
          ""
        )}</div><div style="position: absolute;top: 50%;left: 0;transform: translateY(-50%);box-sizing: border-box;z-index:2;"><a href="javascript:void(0)" class="${sltelem}__control_left" role="button" style="background: ${slarrowbg};display: inline-block;padding: 5px;line-height: 0;color:inherit;border-radius:50px;opacity:0.85;margin:5px;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg></a></div><div style="position: absolute;right: 0;top: 50%;transform: translateY(-50%);box-sizing: border-box;z-index:2;"><a href="javascript:void(0)" class="${sltelem}__control_right" role="button" style="background: ${slarrowbg};display: inline-block;padding: 5px;line-height: 0;color:inherit;border-radius:50px;opacity:0.85;margin:5px;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></a></div></div>`;
      return htmldom;
    }

    function sliderinit(targetElem, move = "right") {
      var mainSlider = targetElem.querySelector(`.${sltelem}`);
      var listSlider = mainSlider.querySelector(`.${sltelem}__wrapper`);
      var itemSlider = listSlider.querySelectorAll(`.${sltelem}__item`);
      var prevBtn = mainSlider.querySelector(`.${sltelem}__control_left`);
      var nextBtn = mainSlider.querySelector(`.${sltelem}__control_right`);
      var sliderInterval;

      function resetPos() {
        itemSlider.forEach(function (element) {
          element.classList.remove("transition");
          element.classList.remove("left");
          element.classList.remove("right");
        });
      }

      prevBtn.addEventListener("click", function () {
        prev();
        resetPos();
      });

      nextBtn.addEventListener("click", function () {
        next();
        resetPos();
      });

      mainSlider.addEventListener("mouseenter", function () {
        clearInterval(sliderInterval);
      });

      mainSlider.addEventListener("mouseleave", function () {
        sliderInterval = setInterval(function () {
          next();
          resetPos();
        }, slspeed);
      });

      function prev() {
        var sliderLength = itemSlider.length;
        itemSlider.forEach(function (element) {
          var curPos = parseInt(element.style.order);
          if (move === "right") {
            if (curPos > 1) {
              element.style.order = curPos - 1;
            } else {
              curPos = sliderLength;
              element.style.order = curPos;
            }
          } else {
            if (curPos < sliderLength) {
              element.style.order = curPos + 1;
            } else {
              curPos = 1;
              element.style.order = curPos;
            }
          }
        });
      }

      function next() {
        var sliderLength = itemSlider.length;
        itemSlider.forEach(function (element) {
          var curPos = parseInt(element.style.order);
          if (move === "right") {
            var curPos = parseInt(element.style.order);
            if (curPos < sliderLength) {
              element.style.order = curPos + 1;
            } else {
              curPos = 1;
              element.style.order = curPos;
            }
          } else {
            if (curPos > 0) {
              element.style.order = curPos - 1;
            } else {
              curPos = sliderLength - 1;
              element.style.order = curPos;
            }
          }
        });
      }

      function stopAllVid() {
        var videos = document.getElementsByTagName("video");
        for (var i = 0; i < videos.length; i++) {
          videos[i].pause();
        }

        var iframes = document.getElementsByTagName("iframe");
        for (var j = 0; j < iframes.length; j++) {
          var src = iframes[j].src;
          iframes[j].src = src;
        }
      }

      mainSlider.addEventListener("click", function (e) {
        let closestButton = e.target.closest("button");
        if (closestButton) {
          stopAllVid();
          let id = closestButton.id;
          let src = closestButton.dataset.src;
          let type = closestButton.dataset.type;
          let thumb = closestButton.dataset.thumb;
          let ratio = closestButton.dataset.ratio;
          let repdom;
          if (type === "video") {
            repdom = `<div id="${id}" data-type="video" data-src="${src}"><div style="position: relative;display: block;height: 0;padding: 0;overflow: hidden;margin:0 auto;padding-bottom: ${ratio}%;"><video autoplay="autoplay" muted="" loop="" poster="undefined" controls style="position: absolute;top: 0;bottom: 0;left: 0;width: 100%;height: 100%;border: 0;"><source src="${decodeURIComponent(
              src
            )}" type="video/mp4"><img alt="banner-video-image" src="${thumb}" title="video" style="margin: 0 auto;display: block;max-width: 100%;height: auto;"><p>Your browser does not support HTML5 video. Here is a <a href="${decodeURIComponent(
              src
            )}" type="video/mp4" tabindex="0">link to the video</a> instead.</p></video></div></div>`;
          } else if (type === "embed") {
            repdom = `<div id="${id}" data-type="video" data-src="${src}"><div class="responsive-embed" style="position: relative;display: block;height: 0;padding: 0;overflow: hidden;margin:0 auto;padding-bottom: ${ratio}%;" style="align-self:center;">${decodeURIComponent(
              src
            )}</div></div>`;
          } else {
            repdom = `<div id="${id}"><p style="margin-bottom:0">Nothing found</p></div>`;
          }

          closestButton.parentElement.outerHTML = repdom;
        }
      });

      function initInfinity() {
        sliderInterval = setInterval(function () {
          next();
          resetPos();
        }, slspeed);
        if (move === "right") {
          prev();
          itemSlider.forEach(function (element, index) {
            element.style.order = index - 1;
          });
        }
        if (move === "left") {
          itemSlider.forEach(function (element, index) {
            element.style.order = index + 1;
          });
        }
      }
      initInfinity();
    }

    function slLoadImages(target) {
      const lazyImages = target.querySelectorAll("img[data-src]");
      lazyImages.forEach(function (img) {
        let src = img.dataset.src;
        let newImg = new Image();
        newImg.onload = function () {
          img.setAttribute("src", src);
        };
        newImg.src = src;
      });
    }

    function getstyle() {
      const existingStyleElement = document.head.querySelector(
        "style#style-rslider"
      );

      if (!existingStyleElement) {
        var sldstyle = document.createElement("style");
        sldstyle.id = "style-" + sltelem;
        sldstyle.textContent = `.rslider .responsive-embed iframe {object-fit: fill;position: absolute;top: 0;left: 0;width: 100%;height: 100%;}`;
        document.head.appendChild(sldstyle);
      }
    }

    function sliderinitilize() {
      var targetElement = document.querySelector(target);
      const currslid = genANCode(7);
      fetchCSVData(csvfile)
        .then((response) => {
          getstyle();
          const data = csvToJson(response);
          data.pop();
          return data;
        })
        .then((dataarr) => {
          const dombuild = dataToDom(dataarr, targetElement);
          targetElement.insertAdjacentHTML("beforeend", dombuild);
          targetElement.innerHTML = dombuild;
          return targetElement;
        })
        .then((target) => {
          sliderinit(target, sldirection);
          window.onload = slLoadImages(target);
        })
        .then(() => {
          window.removeEventListener("scroll", sliderinitilize);
          window.removeEventListener("resize", sliderinitilize);
          window.removeEventListener("orientationchange", sliderinitilize);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    sliderinitilize();
  }
