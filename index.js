let topic = ''


 function inputSearchTerms (){
     $('#topic').on('click', 'li.mdl-menu__item', event => {
        topic = $(event.currentTarget).closest('li').attr('data-val');
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
        callback(result);
    }).fail(function(err) {
        throw err;
        });
    }

 function handleApiResults (data){
     console.log('handleApiResults ran');
     const allPages = data.response.docs;
     console.log(allPages);
     const pageOne = allPages.map(function(page) 
        {  
            console.log(page);
            $('.mdl-grid.top-row').append(page.headline.main);
            return 
            `<div class="mdl-cell mdl-cell--2-col">
                <div class="demo-card-square mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title mdl-card--expand">
                        <h2 class="mdl-card__title-text">${page.headline.main}</h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                       ${page.snippet}
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <a href=${page.web_url} class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                            Read More
                        </a>
                    </div>
                </div>
            </div>`;
            /*`<div class="article">
            <a href=${page.web_url}> ${page.headline.main}</a>
            ${page.multimedia.length > 1 ? `<img src='http://www.nytimes.com/${page.multimedia[1].url}'>` : ''}
            <p>${page.snippet}</p>
            </div>`; */

        });
        console.log(pageOne);
        $('.top-row').html(pageOne);
     }      





//pull out only the headline, snippet, photo, and link



$(inputSearchTerms());
//$(getDataFromApi ('19720801', '19720801', handleApiResults));