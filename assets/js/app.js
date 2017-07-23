let btnContainer = $("#gen-btn-area"),
    display = $("#display"),
    section = $("section"),
    input = $("#search-term"),
    searchBtn = $("#search-btn");

// when search button is clicked on...
searchBtn.click(function(e) {
    e.preventDefault();

    let searchTerms = [];

    let searchTerm = input.val().trim().toLowerCase();

    // if search term is already in array, empty input
    if (searchTerms.includes(searchTerm)) {
        input.val("");
    }

    //  && searchTerm.match(/^[0-9a-zA-Z]+$/)

    // only do a search if input is not empty and is not already in search terms array
    if (searchTerm && !searchTerms.includes(searchTerm.toLowerCase())) {
        // Empty input when search button is clicked
        input.val("");

        // place search term in searchTerms array
        searchTerms.push(searchTerm);

        //empty input box after button is clicked
        // btnContainer.empty();

        // iterate through array of search terms and call api for each
        searchTerms.map(function(term, index) {
            var quantity = 11;

            let queryURL = `https://api.giphy.com/v1/gifs/search?q=${term}&api_key=dc6zaTOxFJmzC&limit=100`;

            let gifs = [];

            //Do AJAX call and find gifs
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function(response) {
                response.data.map(function(obj) {
                    gifs.push(obj);
                });
            });

            let BtnArea = $(`<div class="btn-area" id="${term}"></div>`);
            let genBtn = $(`<button class="gen-btn btn btn-area">${term}</button>`).appendTo(BtnArea);
            let removeBtn = $(`<i class="fa fa-remove remove" aria-hidden="true"></i>`).appendTo(BtnArea);
            console.log('index: ', term);
            console.log(index);

            // when remove button is clicked remove the generated button
            removeBtn.click(function() {

                let parent = $(this).parent();
                parent.hide();
            });

            // let parent = $(this).parent();
            // parent.hide(); 

            genBtn.on("click", function(e) {

                // function to display gifs
                function populate() {
                    display.empty();
                    // empty the display area before it's populated
                    gifs.map(function(obj, i, gifsArr) {
                        if (i < quantity) {
                            // get still and animated images
                            let stillImg = gifsArr[i].images.fixed_height_still.url,
                                animatedImg = gifsArr[i].images.fixed_height.url;

                            // create image with attributes
                            let img = $(`<img 
                            src=${stillImg}
                            data-still${stillImg} 
                            data-animated${animatedImg}
                            class='gif'/>`).appendTo(display);

                            // toggle animation and css class
                            img.click(function() {
                                $(this).toggleClass("selected").animate("shake");
                                let src = $(this).attr("src");
                                if (src === stillImg) {
                                    $(this).attr("src", animatedImg);
                                } else {
                                    $(this).attr("src", stillImg);
                                }
                            });
                        }
                    });
                }

                // this is executed when generated btn is clicked
                populate();
                $("#show-more").click(function() {
                    // add 10 more gifs to display area 
                    quantity += 10;
                    populate();
                });
            });

            BtnArea.prependTo("#gen-btn-area");
        });
    }
});

