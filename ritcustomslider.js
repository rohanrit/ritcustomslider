(function ($) {
  "use strict";
  $.fn.ritcustcarousel = function (options) {
    var settings = $.extend(
      {
        url: null,
        slides: 3,
        direction: "left",
        speed: "2500",
        arrowbg: "#343a40",
        thumb: "http://placehold.it/600x400&text=thumb",
        slideinit: $.noop,
      },
      options
    );

    const $this = $(this);
    const slurl = settings.url;
    const slslides = settings.slides;
    const sldirection = settings.direction;
    const slspeed = settings.speed;
    const slarrowbg = settings.arrowbg;
    const slthumb = settings.thumb;
    const currslid = genANCode(7);

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

    function genANCode(length) {
      let result = "";
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

    function dataToDom(objarr) {
      let htmldom = "";
      htmldom +=
        '<div id="' +
        currslid +
        '" class="carousel slide" data-ride="carousel" data-interval="' +
        slspeed +
        '" data-pause="hover" style="width: 100%;">';
      htmldom += '<div class="carousel-inner" role="listbox">';
      objarr.map((obj, i) => {
        let activeitem = i == 0 ? "active" : "";
        htmldom += '<div class="carousel-item ' + activeitem + '">';
        htmldom += '<div class="carousel-box">';
        if (obj.type === "video") {
          htmldom +=
            '<div id="' +
            genANCode(5) +
            '" class="box-wrapper" data-type="' +
            obj.type +
            '" data-src="' +
            obj.src +
            '" data-src="' +
            obj.poster +
            '">';
          htmldom +=
            '<img class="img-fluid full-width lazy-load-media" src="' +
            slthumb +
            '" data-src="' +
            obj.poster +
            '" alt="' +
            obj.alt +
            '" />';
          htmldom += '<div class="box-btnwrap">';
          htmldom +=
            '<button class="playButton"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ffffff" class="bi bi-play-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg></button>';
          htmldom += "</div>";
          htmldom += "</div>";
        } else if (obj.type === "embed") {
          htmldom +=
            '<div id="' +
            genANCode(5) +
            '" class="box-wrapper" data-type="' +
            obj.type +
            '" data-src="' +
            obj.alt +
            '" data-src="' +
            obj.poster +
            '">';
          htmldom +=
            '<img class="img-fluid full-width lazy-load-media" src="' +
            slthumb +
            '" data-src="' +
            obj.poster +
            '" alt="' +
            obj.alt +
            '" />';
          htmldom += '<div class="box-btnwrap">';
          htmldom +=
            '<button class="playButton"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ffffff" class="bi bi-play-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg></button>';
          htmldom += "</div>";
          htmldom += "</div>";
        } else {
          htmldom += '<div class="box-wrapper">';
          if (obj.redirect != "N/a" || obj.redirect != "") {
            htmldom +=
              '<a href="' +
              obj.redirect +
              '" title="' +
              obj.alt +
              '" target="_blank" style="display: block;width:100%;height: 100%;">';
            htmldom +=
              '<img class="img-fluid full-width lazy-load-media" src="' +
              slthumb +
              '" data-src="' +
              obj.src +
              '" alt="' +
              obj.alt +
              '" />';
            htmldom += "</a>";
          } else {
            htmldom +=
              '<img class="img-fluid full-width lazy-load-media" src="' +
              slthumb +
              '" data-src="' +
              obj.src +
              '" alt="' +
              obj.alt +
              '" />';
          }
          htmldom += "</div>";
        }

        htmldom += "</div>";
        htmldom += "</div>";
      });
      htmldom += "</div>";
      htmldom +=
        '<a class="carousel-control-prev" href="#' +
        currslid +
        '" role="button" data-slide="prev" style="background:' +
        slarrowbg +
        ';max-width: 25px;">';
      htmldom +=
        '<span class="carousel-control-prev-icon" aria-hidden="true"></span>';
      htmldom += '<span class="sr-only">Previous</span>';
      htmldom += "</a>";
      htmldom +=
        '<a class="carousel-control-next" href="#' +
        currslid +
        '" role="button" data-slide="next" style="background:' +
        slarrowbg +
        ';max-width: 25px;">';
      htmldom +=
        '<span class="carousel-control-next-icon" aria-hidden="true"></span>';
      htmldom += '<span class="sr-only">Next</span>';
      htmldom += "</a>";
      htmldom += "</div>";

      return htmldom;
    }

    function getstyle(ratio) {
      let slideratio = 100 / slslides;
      let slwidth = $("#" + currslid)
        .find(".carousel-box")
        .width();
      const sldstyle = document.createElement("style");
      sldstyle.textContent = `#${currslid} .carousel-item.active,#${currslid} .carousel-item-next,#${currslid} .carousel-item-prev {display: flex;flex-direction:row;transition: transform 0.6s ease-in-out;}
    #${currslid} .carousel-item-right.active,#${currslid} .carousel-item-next {transform: translateX(${slwidth}px);}
    #${currslid} .carousel-item-left.active,#${currslid} .carousel-item-prev {transform: translateX(${slwidth}px);}
    #${currslid} .carousel-item .carousel-box {-webkit-box-flex: 0;-ms-flex: 0 0 ${slideratio}%;flex: 0 0 ${slideratio}%;max-width: ${slideratio}%;}
    #${currslid} .carousel-item .box-wrapper {position: relative;overflow: hidden;display:flex;align-items: stretch;justify-content: stretch;height: 100%;margin: auto;background: #111;}
    #${currslid} .carousel-item .box-btnwrap {position: absolute;top: calc(50% - 24px);left: calc(50% - 24px);z-index:2;}
    #${currslid} .carousel-item button.playButton,#${currslid} .carousel-item button.playButton:focus {padding:0;border-radius: 50%;border:none;background:transparent;outline:none;box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;}
    #${currslid} .carousel-item .box-wrapper img.full-width{height: 100%;width: auto;object-fit: cover;}
    `;
      document.head.appendChild(sldstyle);
    }

    function slLoadImages() {
      $this.find("img[data-src]").each(function () {
        var $img = $(this);
        var src = $img.data("src");
        $("<img>")
          .on("load", function () {
            $img.attr("src", src);
          })
          .attr("src", src);
      });
    }

    var intervalID;

    function startSlInterval() {
      $this.on("slide.bs.carousel", function () {
        // stopSlInterval();
        // startSlInterval();
        intervalID = setInterval(function () {
          if (sldirection != "right") $("#" + currslid).carousel("prev");
          else $("#" + currslid).carousel("next");
        }, slspeed);
      });
    }

    function stopSlInterval() {
      clearInterval(intervalID);
    }

    function stopAllVid() {
      $("video").each(function () {
        this.pause();
      });
      $("iframe").each(function () {
        var src = $(this).attr("src");
        $(this).attr("src", src);
      });
    }

    $this.on("click", ".playButton", function (event) {
      $this.carousel("pause");
      stopSlInterval();
      if ($(event.currentTarget).hasClass("playButton")) {
        var elemparent = $(this).closest(".box-wrapper");
        let elemsrc = elemparent.attr("data-src");
        let elemtype = elemparent.attr("data-type");
        let elemthumb = elemparent.attr("data-thumb");
        stopAllVid();

        if (elemtype === "video") {
          let dydom = "";
          dydom +=
            '<div class="embed-responsive embed-responsive-4by3 my-0" style="background: #111 !important;">';
          dydom +=
            '<video autoplay="autoplay" muted="" loop="" poster="' +
            elemthumb +
            '">';
          dydom += '<source src="' + elemsrc + '" type="video/mp4">';
          dydom +=
            '<img alt="banner-video-image" src="' +
            elemthumb +
            '" title="banner-video">';
          dydom +=
            '<p>Your browser does not support HTML5 video. Here is a <a href="' +
            elemsrc +
            '" type="video/mp4" tabindex="0">link to the video</a> instead.</p>';
          dydom += "</video>";
          dydom += "</div>";
          elemparent.html(dydom);
        } else if (elemtype === "embed") {
          let dydom = "";
          dydom +=
            '<div class="embed-responsive embed-responsive-4by3" style="align-self:center;">';
          dydom +=
            '<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
            elemsrc +
            '?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
          dydom += "</div>";
          elemparent.html(dydom);
        } else {
          return false;
        }
      } else {
        startSlInterval();
      }
    });

    fetchCSVData(slurl)
      .then((response) => {
        const data = csvToJson(response);
        data.pop();
        return data;
      })
      .then((dataarr) => {
        const dombuild = dataToDom(dataarr);
        return dombuild;
      })
      .then((modifiedData) => {
        getstyle(currslid);
        $this.append(modifiedData);
        $(".carousel .carousel-item").each(function () {
          var minPerSlide = slslides;
          var next = $(this).next();
          if (!next.length) {
            next = $(this).siblings(":first");
          }
          next.children(":first-child").clone().appendTo($(this));

          for (var i = 0; i < minPerSlide; i++) {
            next = next.next();
            if (!next.length) {
              next = $(this).siblings(":first");
            }

            next.children(":first-child").clone().appendTo($(this));
          }
        });
        startSlInterval();

        setTimeout(function () {
          slLoadImages();
        }, 2500);
        $this.carousel("cycle");
      })
      .catch((error) => {
        console.error(error);
      });

    //   end of plugin
  };
})(jQuery);
