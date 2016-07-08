var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var linkscrape = require('linkscrape');

var arrayTrailUrls = [];

// var lineArray = [];
// trailInfo.forEach(function (infoArray, index) {
//     var line = infoArray.join(",");
//     lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
// });
// var csvContent = lineArray.join("\n");

//working function to scrape trail details off particular page and pass details
//into an array

// request('http://www.fs.usda.gov/recarea/deschutes/recreation/hiking/recarea/?recid=38440&actid=50', function scrapeTrailInfo(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var $ = cheerio.load(body);
//     var trailInfo = [];
//     var trailName = [];
//     var trailDetails = [];
//     $('#pagetitletop').each(function(i, element){
//       var div = $(this).find('h1');
//       trailName = $(this).text().trim();
//       trailInfo.push(trailName);
//     });
//     $('#rightcol .themetable .right-box').each(function(i, element){
//       var div = $(this).find('div.box');
//       trailDetails = $(this).text().trim();
//       trailInfo.push(trailDetails);
//     });
//     // trailInfo.push(trailName,trailDetails);
//     console.log(trailInfo);
//     fs.appendFileSync('trailInfo.txt', trailInfo + '\n');
//   };
// });


// requesting each page and scraping details from each page
function trailDetails(arrayTrailUrls) {
  arrayTrailUrls.forEach(function(trailsUrls) {
    request(trailsUrls, scrapeTrailInfo);
  });
};

// scraper for each separate trail
function scrapeTrailInfo(error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    var trailInfo = [];
    var trailName = [];
    var trailDetails = [];
    $('#pagetitletop').each(function(i, element){
      var div = $(this).find('h1');
      trailName = $(this).text().trim();
      trailInfo.push(trailName);
    });
    $('#rightcol .themetable .right-box').each(function(i, element){
      var div = $(this).find('div.box');
      trailDetails = $(this).text().trim();
      trailInfo.push(trailDetails);
    });
    // trailInfo.push(trailName,trailDetails);
    console.log(trailInfo);
    fs.appendFileSync('trailInfo.txt', trailInfo + '\n');
  };
};


//passing the relative path names into absolute paths and into an array

function getURLs(metadataObjects) {
    arrayTrailUrls = [];
    metadataObjects.forEach(function(metadata) {
      var trailsUrls =  'http://www.fs.usda.gov' + metadata.url;
      // console.log(trailsUrls);
      arrayTrailUrls.push(trailsUrls);
    });
    // console.log(arrayTrailUrls);
    trailDetails(arrayTrailUrls);
};


//scraping the table of content URls to be requested

request('http://www.fs.usda.gov/activity/deschutes/recreation/hiking/?recid=38280&actid=50', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var metadataObjects = [];
      $('#centercol .themetable ul li').each(function(i, element){
        var a = $(this).find('a');
        var title = a.text();
        var url = a.attr('href');
        // Our parsed meta data object
        var metadata = {
          title: title,
          url: url
        };
        metadataObjects.push(metadata);
        // relativePathUrls.push(url);
        // console.log(metadata);
        // fs.appendFileSync('links.txt', url)
      });
      getURLs(metadataObjects);
    };
    // console.log(relativePathUrls);
    return true;
  });



// Tualatin Hills skeleton
//
// var request = require('request');
// var cheerio = require('cheerio');
//
// days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// pools = {
//     'Aloha': 3,
//     'Beaverton': 15,
//     'Conestoga': 12,
//     'Harman': 11,
//     'Raleigh': 6,
//     'Somerset': 22,
//     'Sunset': 5,
//     'Tualatin Hills': 2
// };
// for (pool in pools) {
//     var url = 'http://www.thprd.org/schedules/schedule.cfm?cs_id=' + pools[pool];
//
//     request(url, (function(pool) { return function(err, resp, body) {
//         $ = cheerio.load(body);
//         $('#calendar .days td').each(function(day) {
//             $(this).find('div').each(function() {
//                 event = $(this).text().trim().replace(/\s\s+/g, ',').split(',');
//                 if (event.length >= 2 && (event[1].match(/open swim/i) || event[1].match(/family swim/i)))
//                     console.log(pool + ',' + days[day] + ',' + event[0] + ',' + event[1]);
//             });
//         });
//     }})(pool));
// }
