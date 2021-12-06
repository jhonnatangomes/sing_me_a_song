# Sing me a song

Sing me a song is a RESTful api developed with node.js. In it you can suggest songs recommendations and get random recommendations based on the score the recommendations have.

### How to run

Clone the repository in your computer and head over to the newly created directory:

    git clone https://github.com/jhonnatangomes/sing_me_a_song
    cd sing_me_a_song

Then, install dependencies:

    npm install

After everything has been installed, enter in createDB folder and run create-databases script:

    cd createDB
    bash create-databases

You might be prompted to type in your password. After everything is done you can use the connect-database scripts to connect to database:

    bash connect-database
    bash connect-database-test

To start project in development database, just navigate to project root folder and do:

    npm run start:development

To open project in test database with watch enabled, do:

    npm run start:test_watch

To just run tests a single time do:

    npm run test

#### Destroying databases

If you want to delete databases at any time, you can just run destroy-database script in createDB folder with:

    bash destroy-databases

## Endpoints

<details>
<summary><span style="color: #E3994E;">POST</span> <span style="color: #EB5757;">/genres</span></summary>
Creates a new genre with a given name if it does not exist previously. This endpoint expects a JSON body in the format

    {
        "name": "Rock"
    }

</details>

<details>
<summary><span style="color: #448361;">GET</span> <span style="color: #EB5757;">/genres</span></summary>
Returns a list of genres in alphabetical order

    {
        "id": 1,
        "name": "Arrocha"
    },
    {
        "id": 2,
        "name": "Forró"
    },
    {
        "id": 3,
        "name": "Heavy Metal"
    }

</details>

<details>
<summary><span style="color: #448361;">GET</span> <span style="color: #EB5757;">/genres/:id</span></summary>
Returns a genre with all the songs that contain this genre and a total score (sum of all songs score of this genre), in the format

    {
    	"id": 32,
    	"name": "Forró",
    	"score": 357,
    	"recommendations": [
    		{
    			"id": 150,
    			"name": "Chitãozinho E Xororó - Evidências",
    			"genres": [
    				{
    					"id": 32
    					"name": "Forró",
    				},
    				{
    					"id": 23
    					"name": "Metal progressivo",
    				}
    			],
    			"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    			"score": 245
    		},
    		{
    			"id": 12,
    			"name": "Falamansa - Xote dos Milagres",
    			"genres": [
    				{
    					"id": 32
    					"name": "Forró",
    				},
    			],
    			"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    			"score": 112
    		},
    		...
    	]

    }

</details>

<details>
<summary><span style="color: #448361;">GET</span> <span style="color: #EB5757;">/recommendations/genres/:id/random</span></summary>
Returns a random song from the given genre

    {
    "id": 1,
    "name": "Chitãozinho E Xororó - Evidências",
    "genres": [
    	{
    		"id": 32
    		"name": "Forró",
    	},
    	{
    		"id": 23
    		"name": "Metal progressivo",
    	}
    ],
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
    }

</details>

<details>
<summary><span style="color: #E3994E;">POST</span> <span style="color: #EB5757;">/recommendations</span> </summary>
Creates a new song recommendation. Expects a JSON body in the format

    {
    "name": "Falamansa - Xote dos Milagres",
    "genresIds": [32, 23]
    "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    }

</details>

<details>
<summary><span style="color: #E3994E;">POST</span> <span style="color: #EB5757;">/recommendations/:id/upvote</span> </summary>
Increases score of the given recommendation
</details>

<details>
<summary><span style="color: #E3994E;">POST</span> <span style="color: #EB5757;">/recommendations/:id/downvote</span> </summary>
Decreases score of the given recommendation. If a certain recommendation <span style="color: #448361;">GET</span>s a score below -5, it is removed from the database.
</details>

<details>
<summary><span style="color: #448361;">GET</span> <span style="color: #EB5757;">/recommendations/random</span> </summary>
Returns a random recommendation

    {
    "id": 1,
    "name": "Chitãozinho E Xororó - Evidências",
    "genres": [
    	{
    		"id": 32
    		"name": "Forró",
    	},
    	{
    		"id": 23
    		"name": "Metal progressivo",
    	}
    ],
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
    }

</details>

<details>
<summary><span style="color: #448361;">GET</span> <span style="color: #EB5757;">/recommendations/top/:amount</span> </summary>
Returns the top recommendations ordered by score with the given amount of songs passed in the url parameter

    [
    {
    	"id": 150,
    	"name": "Chitãozinho E Xororó - Evidências",
    	"genres": [
    		{
    			"id": 32
    			"name": "Forró",
    		},
    		{
    			"id": 23
    			"name": "Metal progressivo",
    		}
    	],
    	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    	"score": 245
    },
    {
    	"id": 12,
    	"name": "Falamansa - Xote dos Milagres",
    	"genres": [
    		{
    			"id": 32
    			"name": "Forró",
    		},
    	],
    	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    	"score": 112
    },
    ...
    ]

</details>
