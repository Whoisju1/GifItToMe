let btnContainer = $("#gen-btn-area"),
    display = $("#display"),
    section = $("section"),
    input = $("#search-term"),
    searchBtn = $("#search-btn");

let searchTerms = [];

searchBtn.click(function () {
    let searchTerm = input.val().trim();

    // Empty input when search button is clicked
    input.val("");

    // place search term in searchTerms array
    searchTerms.push(searchTerm);

    //empty input box after button is clicked
    btnContainer.empty();

    // iterate through array of search terms and call api for each
    searchTerms.map(function (term) {

        let queryURL = `https://api.giphy.com/v1/gifs/search?q=${term}&api_key=dc6zaTOxFJmzC&limit=100`;

        let gifs = [];

        //Do AJAX call and find gifs
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            response.data.map(function (obj) {
                gifs.push(obj);
            });

        });

        let genBtn = $(`<div class="gen-btn"><p>${term}</p></div>`);

        genBtn.on('click', function () {

            display.empty();

            // function to display gifs
            let populate = function () {
                gifs.map(function (obj, i) {

                    if (i < 11) {
                        // get still and animated images
                        let stillImg = obj.images.fixed_height_still.url,
                            animatedImg = obj.images.fixed_height.url;

                        // create image with attributes
                        let img = $(`<img 
                            src=${stillImg}
                            data-still${stillImg} 
                            data-animated${animatedImg}
                            class='gif'/>`).appendTo(display);

                        // toggle animation
                        img.click(function () {
                            let src = $(this).attr('src');
                            if (src === stillImg) {
                                $(this).attr('src', animatedImg);
                            } else {
                                $(this).attr('src', stillImg);
                            }
                        });
                    }

                });
            };
            populate();
        });

        genBtn.appendTo('#gen-btn-area');
    });
});

