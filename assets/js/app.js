let btnContainer = $("#gen-btn-area"),
    display = $("#display"),
    section = $("section"),
    input = $("#search-term"),
    searchBtn = $("#search-btn");

let searchTerms = [];
let count = 0;
let currentContent;

//display error message for 7 seconds if search comes up empty
function sorryMsg(term) {
    display.html(`<h1 class="sorry"><i class="fa fa-exclamation-triangle faa-flash animated 
    faa-parent" aria-hidden="true"></i>Sorry! No gifs were found for "<span class="wrong">${term}
    </span>". <br/><br/>:-(</h1>`);

    setTimeout(function() {
        display.empty();
    }, 7000);
}


searchBtn.click(function(e) {
    e.preventDefault();

    let searchTerm = input.val().trim().toLowerCase();

    input.val("");

    console.log(`is "${searchTerm}" in Arr? Ans: ${searchTerms.includes(searchTerm)}`);

    if (searchTerms.includes(searchTerm)) {
        console.clear();
        console.error(`"${searchTerm}" already exists.`);
    } else {
        console.clear();
        console.log(`Since "${searchTerm}" is not in Arr, do AJAX search.`);
        let loading = $(`<h1 class="loading">L<i class="fa fa-spinner fa-spin fa-1x" aria-hidden="true"></i>ADING</h1>`).appendTo(display);
        $('.gif').addClass('contrast');
        // this is an array that store all the gifs that will be put into the display area when the generated buttons are clicked
        let gifs = [];

        let queryURL = `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&rating=g&api_key=dc6zaTOxFJmzC&limit=1000`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            response.data.map(function(obj) {
                gifs.push(obj);
            });

            if (response.data.length < 1) {
            // if the search returns empty let the user know by printing it in the display area
                // console.log('search complete but nothing was found! Sorry :(');
                sorryMsg(searchTerm);
            } else {
                loading.remove();
                // create Buttons when all info is sound. 
                // that way when the button is clicked there will always be images already available to be displayed
                makeButtons();

            }

            function makeButtons() {
                //make a button for the present searchTerm, that will be prepended to the container for these generated buttons 
                // after the buttons have been configured
                let BtnArea = $(`<div class="btn-area" id="${searchTerm}"></div>`);
                BtnArea.animate({left: '250px'});
                let genBtn = $(`<div class="gen-btn">${searchTerm}</div>`).appendTo(BtnArea);
                let removeBtn = $(
                    `<i class="fa fa-remove remove" aria-hidden="true"></i>`
                ).appendTo(BtnArea);

                // when remove button is clicked remove the generated button
                removeBtn.click(function() {
                    let parent = $(this).parent();
                    if (currentContent === parent.text()) {
                        display.empty();
                    }
                    parent.remove();
                    // if the current search term is not in the array then an index of -1 will be returned, showing that is not in the array
                    // thus, it has not been search for or has been deleted
                    let ind = searchTerms.indexOf(searchTerm);

                    // if the index is more than  -1 (meaning it is present) then remove it from the array
                    // this prevents the app from thinking that the button is present when it has been deleted, so it's like the
                    // search term was never there in the first place
                    if (ind > -1) {
                        searchTerms.splice(ind, 1);
                    }

                    // if it is the current entry being viewed then empty the display area of it's images
                    
                });

                // the quantity of images to display initially
                let quantity = 10;

                genBtn.on("click", function() {
                    $(".gen-btn").css("color", "#2980b9");
                    $(".gen-btn").parent().css('border-bottom', "1.5px solid #f1c40f");

                    $(this).css("color", "#2ecc71");
                    $(this).parent().css('border-bottom', '1.5px double #2ecc71');

                    // let the app know which search term images are being displayed for and...
                    currentContent = $(this).text();

                    // ... if the images are not for the button the user clicks on then set the quantity to 10
                    // this is in case the use clicks the show more image then clicks the generated button again
                    // and so that when a button is clicked for the first time it will show the default quantity (10)
                    if (currentContent !== $(this).text()) {
                        quantity = 10;
                    }

                    // function for populating the display area with images
                    function populate() {

                    // empty the display area before it's populated
                        display.empty();

                        gifs.map(function(obj, i, gifsArr) {
                            if (i < quantity) {
                                // get still and animated images from each object stored in gifs array
                                let stillImg = gifsArr[i].images.fixed_height_still.url,
                                    animatedImg = gifsArr[i].images.fixed_height.url;

                                // create image with attributes
                                let img = $(`<img 
                            src=${stillImg}
                            data-still${stillImg} 
                            data-animated${animatedImg}
                            class='gif img-thumbnail col-md-5'/>`).appendTo(
                                    display
                                );

                                // toggle animation and css class
                                img.click(function() {
                                    $(this).toggleClass("selected");
                                    let src = $(this).attr("src");
                                    if (src === stillImg) {
                                        $(this).attr("src", animatedImg);
                                    } else {
                                        $(this).attr("src", stillImg);
                                    }
                                });

                                // prevent two "show more" buttons from being created
                                $('#show-more').remove();

                                // create "show more" button and append to display div each time images are created
                                let showMoreBtn = $(
                                    `<button id="show-more" class=" btn btn-primary">Show More</button>`
                                )
                                    .appendTo(display)
                                    .click(function() {
                                        // add 10 more gifs to display area
                                        quantity += 10;
                                        populate();
                                    });
                            }
                        });
                    }

                    // this is executed when generated btn is clicked, populating the display area with images
                    populate();

                });

                this 
                BtnArea.prependTo("#gen-btn-area");
            }
        });

    }
    // only do a search if input is not empty and is not already in search terms array
    if (searchTerm && !searchTerms.includes(searchTerm.toLowerCase())) {
        // place search term in searchTerms array
        if (searchTerms.includes(searchTerm) === false) {
            searchTerms.push(searchTerm);
        }

        // btnContainer.empty();

        //empty input box after button is clicked

        // iterate through array of search terms and call api for each
        searchTerms.map(function(term, index) {
            var quantity = 11;


        // the end of the button creation and all that
        });
    }
});


