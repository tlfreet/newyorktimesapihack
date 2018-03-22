let topic = ''


 function inputSearchTerms (){
     $('#topic').on('click', 'li.mdl-menu__item', event => {
        topic = $(event.currentTarget).closest('li').attr('data-val');
        $('#sample3').val(topic);
     })
     $('#submit-form').submit(function(event) {
        event.preventDefault();
        let date = new Date($('#date').val());
        day = date.getDate() + 1; 
        month = date.getMonth() + 1; 
        year = date.getFullYear(); 
        if (day<10){
            day = '0'+day;
        }  else {day};
        if (month<10){
           month = '0'+month;
        }   else {month}
       beginDate = [year, month, day].join("");
       endDate = [year, month, day + 1].join("");
       console.log(beginDate)
        getDataFromApi(beginDate, endDate, handleApiResults);
         })
}

function getDataFromApi(begin_date, end_date, callback){
    //inputSearchTerms();
    console.log(topic);
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "a2df3a93ff5541dd979083ae7243e85c",
        'fq': `source:("The New York Times") AND news_desk:("${topic}")`,
        'begin_date': begin_date,
        'end_date': end_date,
        'fl': 'print_page,web_url,source,news_desk,headline,pub_date, multimedia, snippet',
        'page':'0',
    });
    $.ajax({
         url: url,
         method: 'GET',
    }).done(function(result) {
        let doc = result.response.docs
        if(doc.length !== 0){
        callback(result);
    }
    else{
        $('.trial').html(`<h1>Sorry, there don't seem to be articles for that search! Feel free to try again<h1>`);
    }
    }).fail(function(err) {
        throw err;
        });
    }

 function handleApiResults (data){
     console.log('handleApiResults ran');
     const allPages = data.response.docs;
     console.log(allPages);
     const renderResults = allPages.map(function(page) 
        { 
            return `<div class="mdl-cell mdl-cell--3-col">
                <div class="demo-card-square mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title mdl-card--expand">
                        <h2 class="mdl-card__title-text">${page.headline.main}</h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                       ${page.snippet ? page.snippet : '<p class="blurry-text"> Knight Foundation lede Google News NPR stupid commenters Walter Cronkite Nate Silver dingbat hyperlocal rubber cement </p>'}
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <a href=${page.web_url} class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                            Read More
                        </a>
                    </div>
                </div>
            </div>`;
            `<div class="article">
            <a href=${page.web_url}> ${page.headline.main}</a>
            ${page.multimedia.length > 1 ? `<img src='http://www.nytimes.com/${page.multimedia[1].url}'>` : ''}
            <p>${page.snippet}</p>
            </div>`; 

        });
        $('.trial').html(renderResults);
     }      





//pull out only the headline, snippet, photo, and link



$(inputSearchTerms());
//$(getDataFromApi ('19720801', '19720801', handleApiResults));