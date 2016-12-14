/*
This work is licensed under the Creative Commons Attribution- NonCommercial 4.0 International License. To view a copy
of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or send a letter to Creative Commons, 444 Castro
Street, Suite 900, Mountain View, California, 94041, USA.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* ******* Unreal Geometry Map-Mod by Desno365 ******* */

//updates variables
const CURRENT_VERSION = "r003";
var latestVersion;

//activity and other Android variables
var currentActivity = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

//display size and density variables
var metrics = new android.util.DisplayMetrics();
currentActivity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
var displayHeight = metrics.heightPixels;
var displayWidth = metrics.widthPixels;
var deviceDensity = metrics.density;
metrics = null;

// saving variabes
var worldPath;
const MAX_POSITION = 10;

// unreal geometry variables
var position = 0;
var previousX = 0;
var previousY = 0;
var previousZ = 0;

var doorOpen = true;

/*
var array = [];
var l = 13;
for(var i = 0; i < l; i++)
{
	array[i] = [];
	for(var j = 0; j < l; j++)
	{
		array[i][j] = [];
	}
}
*/


function selectLevelHook()
{
	//
	worldPath = android.os.Environment.getExternalStorageDirectory() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir();
}

function newLevel()
{
	new java.lang.Thread(new java.lang.Runnable()
	{ 
		run: function()
		{
			updateLatestVersionMap();
			if(latestVersion != CURRENT_VERSION && latestVersion != undefined)
				updateAvailableUI();
		}
	}).start();

	// load previous position if present
	loadSavedPosition();

	currentActivity.runOnUiThread(new java.lang.Runnable() {
		run: function() {
			android.widget.Toast.makeText(currentActivity, new android.text.Html.fromHtml("Unreal Geometry Mod started."), 0).show();
		}
	});
}

function leaveGame()
{
	// save position in a file
	saveCurrentPosition();
}

function useItem(x, y, z, itemId, blockId, side, itemDamage)
{
	x = Math.floor(x);
	y = Math.floor(y);
	z = Math.floor(z);

	if(x == 974 && y == 5 && (z == 78 || z == 79))
	{
		// player hit the discover other great things sign
		preventDefault();
		discoverGreatThings();
		return;
	}

	/*
		// simple code for copying buildings
		if(itemId == 267) // iron sword
		{
			new java.lang.Thread(new java.lang.Runnable()
			{ 
				run: function()
				{
					for (var i = 0; i < l; i++)
					{
						for (var j = 0; j < l; j++)
						{
							for (var k = 0; k < l; k++)
							{
								array[i][j][k] = Level.getTile(x + i, y + j, z + k);
							}
						}
					}

					clientMessage("Ready");
				}
			}).start();
		}

		if(itemId == 352) // bone
		{
			new java.lang.Thread(new java.lang.Runnable()
			{ 
				run: function()
				{
					for (var i = 0; i < l; i++)
					{
						for (var j = 0; j < l; j++)
						{
							for (var k = 0; k < l; k++)
							{
								if(array[i][j][k] != 0)
								{
									Level.setTile(x + i, y + j, z + k, array[i][j][k]);
								}
							}
						}
					}

					clientMessage("Done");
				}
			}).start();
		}
	*/
}

function attackHook(attacker, victim)
{
	// prevents painting to be removed
	if(Entity.getEntityTypeId(victim) == EntityType.PAINTING)
		preventDefault();
}

function startDestroyBlock(x, y, z, side)
{
	// prevents block destruction
	preventDefault();
}

function destroyBlock(x, y, z, side)
{
	// prevents block destruction
	preventDefault();
}

function entityAddedHook(entity)
{
	// remove entities that may spawn randomly inside the map
	var entityId = Entity.getEntityTypeId(entity);
	if(entityId != 0)
	{
		if(entityId == EntityType.BAT || entityId == EntityType.CAVE_SPIDER || entityId == EntityType.CHICKEN || entityId == EntityType.COW || entityId == EntityType.CREEPER || entityId == EntityType.ENDERMAN || entityId == EntityType.OCELOT || entityId == EntityType.PIG || entityId == EntityType.PIG_ZOMBIE || entityId == EntityType.PRIMED_TNT || entityId == EntityType.RABBIT || entityId == EntityType.SHEEP || entityId == EntityType.SKELETON || entityId == EntityType.SLIME || entityId == EntityType.SPIDER || entityId == EntityType.VILLAGER || entityId == EntityType.WOLF || entityId == EntityType.ZOMBIE || entityId == EntityType.ZOMBIE_VILLAGER)
		{
			Entity.remove(entity);
		}
	}
}

function modTick()
{
	var x = Player.getX();
	var y = Player.getY();
	var z = Player.getZ();

	if(position == 0)
	{
		if(z > 5.5 && previousZ <= 5.5)
		{
			if(x < 896 && x > 893)
			{
				Entity.setPosition(Player.getEntity(), x + 12, y, z);
				position = 1;
			}
		}
	} else

	if(position == 1)
	{
		if(z < 5.5 && previousZ >= 5.5)
		{
			if(x < 908 && x > 905)
			{
				Entity.setPosition(Player.getEntity(), x - 12, y, z);
				position = 0;
			}


			if(x < 902 && x > 899)
			{
				Entity.setPosition(Player.getEntity(), x, y, z + 12);
				position = 2;
			}
		}
	} else

	if(position == 2)
	{
		if(z > 17.5 && previousZ <= 17.5)
		{
			if(x < 902 && x > 899)
			{
				Entity.setPosition(Player.getEntity(), x, y, z - 12);
				position = 1;
			}


			if(x < 908 && x > 905)
			{
				Entity.setPosition(Player.getEntity(), x, y, z + 12);
				position = 3;
			}
		}
	} else

	if(position == 3)
	{
		if(z < 29.5 && previousZ >= 29.5)
		{
			if(x < 908 && x > 905)
			{
				Entity.setPosition(Player.getEntity(), x, y, z - 12);
				position = 2;
			}


			if(x < 902 && x > 899)
			{
				Entity.setPosition(Player.getEntity(), x, y, z + 12);
				position = 4;
			}
		}
	} else

	if(position == 4)
	{
		if(z > 41.5 && previousZ <= 41.5)
		{
			if(x < 902 && x > 899)
			{
				Entity.setPosition(Player.getEntity(), x, y, z - 12);
				position = 3;
			}


			if(x < 908 && x > 905)
			{
				Entity.setPosition(Player.getEntity(), x + 12, y, z);
				position = 5;
			}
		}
	} else

	if(position == 5)
	{
		if(z < 41.5 && previousZ >= 41.5)
		{
			if(x < 920 && x > 917)
			{
				Entity.setPosition(Player.getEntity(), x - 12, y, z);
				position = 4;
			}


			if(x < 914 && x > 911)
			{
				Entity.setPosition(Player.getEntity(), x, y, z - 12);
				position = 6;
			}
		}
	} else

	if(position == 6)
	{
		if(z > 29.5 && previousZ <= 29.5)
		{
			if(x < 914 && x > 911)
			{
				Entity.setPosition(Player.getEntity(), x, y, z + 12);
				position = 5;
			}


			if(x < 920 && x > 917)
			{
				Entity.setPosition(Player.getEntity(), x, y, z - 12);
				position = 7;
			}
		}
	} else

	if(position == 7)
	{
		if(z < 17.5 && previousZ >= 17.5)
		{
			if(x < 920 && x > 917)
			{
				Entity.setPosition(Player.getEntity(), x, y, z + 12);
				position = 6;
			}


			if(x < 914 && x > 911)
			{
				Entity.setPosition(Player.getEntity(), x, y, z - 12);
				position = 8;
				closeDoor();
			}
		}
	} else

	if(position == 8)
	{
		if(z > 5.5 && previousZ <= 5.5)
		{
			if(x < 914 && x > 911)
			{
				Entity.setPosition(Player.getEntity(), x, y, z + 12);
				position = 7;
			}

			if(x < 966 && x > 965)
			{
				Entity.setPosition(Player.getEntity(), x - 12, y, z + 30);
				position = 9;
			}
		}

		if(z > 17.5 && previousZ <= 17.5)
		{
			if(x < 942 && x > 941)
			{
				Entity.setPosition(Player.getEntity(), x, y, z - 24);
				openDoor();
			}
		}

		if(z < -7.5 && previousZ >= -7.5)
		{
			if(x < 942 && x > 941)
			{
				Entity.setPosition(Player.getEntity(), x, y, z + 24);
				openDoor();
			}
		}
	} else

	if(position == 9)
	{
		if(z < 35.5 && previousZ >= 35.5)
		{
			if(x < 954 && x > 953)
			{
				Entity.setPosition(Player.getEntity(), x + 12, y, z - 30);
				position = 8;
			}
		}

		if((x < 974.5 && previousX >= 974.5) || (x > 974.5 && previousX <= 974.5))
		{
			if(z < 25 && z > 24)
			{
				Entity.setPosition(Player.getEntity(), x, y, z + 32);
				position = 10;
			}
		}
	} else

	if(position == 10)
	{
		if((x < 974.5 && previousX >= 974.5) || (x > 974.5 && previousX <= 974.5))
		{
			if(z < 57 && z > 56)
			{
				Entity.setPosition(Player.getEntity(), x, y, z - 32);
				position = 9;
			}
		}
	}

	//  to add a new position also the MAX_POSITION must be changed

	previousX = x;
	previousZ = z;


	// always max hunger
	Player.setHunger(20);
}


//############################################################################
// Added functions (No GUI and No render)
//############################################################################

//########## MAP functions ##########
function openDoor()
{
	if(!doorOpen)
	{
		Level.setTile(948, 5, 5, 0);
		Level.setTile(948, 4, 5, 0);
	}
	doorOpen = true;
}

function closeDoor()
{
	if(doorOpen)
	{
		Level.setTile(948, 5, 5, 155);
		Level.setTile(948, 4, 5, 155);
	}
	doorOpen = false;
}

function discoverGreatThings()
{
	currentActivity.runOnUiThread(new java.lang.Runnable()
	{
		run: function()
		{
			try
			{
				var intentBrowser = new android.content.Intent(currentActivity);
				intentBrowser.setAction(android.content.Intent.ACTION_VIEW);
				intentBrowser.setData(android.net.Uri.parse("http://desno365.github.io/minecraft/"));
				currentActivity.startActivity(intentBrowser);
			}catch (err)
			{
				clientMessage("Error: " + err);
			}
		}
	});
}

function loadSavedPosition()
{
	currentActivity.runOnUiThread(new java.lang.Runnable()
	{
		run: function()
		{
			try
			{
				var loadFile = java.io.File(worldPath + "/unreal.dat");
				if(loadFile.exists())
				{
					// load text
					var loadedText = "";
					var streamInput = new java.io.FileInputStream(loadFile);
					var bufferedReader = new java.io.BufferedReader(new java.io.InputStreamReader(streamInput));
					var row = "";
					while((row = bufferedReader.readLine()) != null) 
					{
						loadedText += row;
					}

					// check loaded text
					var arrayText = loadedText.split(" ");
					var loadedPosition = parseInt(arrayText[0]);
					if(loadedPosition >= 0 && loadedPosition <= MAX_POSITION)
					{
						position = loadedPosition;
					}

					bufferedReader.close();
				}else
				{
					position = 0;
				}
			}catch(err)
			{
				clientMessage("Error: " + err);
			}
		}
	});
}

function saveCurrentPosition()
{
	currentActivity.runOnUiThread(new java.lang.Runnable()
	{
		run: function()
		{
			try
			{
				// create file
				var saveFile = new java.io.File(worldPath + "/unreal.dat");
				if(saveFile.exists())
					saveFile.delete();
				saveFile.createNewFile();

				// save things
				var streamOutput = new java.io.FileOutputStream(saveFile);
				var streamWriter = new java.io.OutputStreamWriter(streamOutput);
				streamWriter.append(position + " position");

				// close things
				streamWriter.close();
				streamOutput.close();
			}catch(err)
			{
				clientMessage("Error: " + err);
			}
		}
	});
}
//########## MAP functions - END ##########


//########## MISC functions ##########
function updateLatestVersionMap()
{
	try
	{
		// download content
		var url = new java.net.URL("https://raw.githubusercontent.com/Desno365/MCPE-scripts/master/unrealMAP-version-2");
		var connection = url.openConnection();
 
		// get content
		inputStream = connection.getInputStream();
 
		// read result
		var loadedVersion = "";
		var bufferedVersionReader = new java.io.BufferedReader(new java.io.InputStreamReader(inputStream));
		var rowVersion = "";
		while((rowVersion = bufferedVersionReader.readLine()) != null)
		{
			loadedVersion += rowVersion;
		}
		latestVersion = loadedVersion.split(" ")[0];
 
		// close what needs to be closed
		bufferedVersionReader.close();
		inputStream.close();
	} catch(err)
	{
		clientMessage("Unreal Geometry Mod: Can't check for updates, please check your Internet connection.");
		ModPE.log("Unreal Geometry Mod: updateLatestVersionMap(): caught an error: " + err);
	}
}

function convertDpToPixel(dp)
{
	//
	return Math.round(dp * deviceDensity);
}
//########## MISC functions - END ##########


//########################################################################################################################################################
// Utils of UI functions
//########################################################################################################################################################

const MARGIN_HORIZONTAL_BIG = 16;
const MARGIN_HORIZONTAL_SMALL = 4;

function setMarginsLinearLayout(view, left, top, right, bottom)
{
	var originalParams = view.getLayoutParams();
	var newParams = new android.widget.LinearLayout.LayoutParams(originalParams);
	newParams.setMargins(convertDpToPixel(left), convertDpToPixel(top), convertDpToPixel(right), convertDpToPixel(bottom));
	view.setLayoutParams(newParams);
}


//############################################################################
// UI functions
//############################################################################

function updateAvailableUI()
{
	currentActivity.runOnUiThread(new java.lang.Runnable()
	{
		run: function()
		{
			try
			{
				var layout = new android.widget.LinearLayout(currentActivity);
				var padding = convertDpToPixel(8);
				layout.setPadding(padding, padding, padding, padding);
				layout.setOrientation(android.widget.LinearLayout.VERTICAL);

				var scroll = new android.widget.ScrollView(currentActivity);
				scroll.addView(layout);
			
				var popup = new android.app.Dialog(currentActivity); 
				popup.setContentView(scroll);
				popup.setTitle(new android.text.Html.fromHtml("Unreal Geometry Map: new version"));
				
				var updateText = new android.widget.TextView(currentActivity);
				updateText.setText(new android.text.Html.fromHtml("New version available, you have the " + CURRENT_VERSION + " version and the latest version is " + latestVersion + ".<br>" +
					"You can download the new version on Desno365's website (press the button to visit it)."));
				layout.addView(updateText);
				setMarginsLinearLayout(updateText, 0, MARGIN_HORIZONTAL_SMALL, 0, MARGIN_HORIZONTAL_SMALL);

				var downloadButton = new android.widget.Button(currentActivity); 
				downloadButton.setText("Visit website"); 
				downloadButton.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function()
					{
						var intentBrowser = new android.content.Intent(currentActivity);
						intentBrowser.setAction(android.content.Intent.ACTION_VIEW);
						intentBrowser.setData(android.net.Uri.parse("http://desno365.github.io/minecraft/unreal-map/"));
						currentActivity.startActivity(intentBrowser);
						popup.dismiss();
					}
				});
				layout.addView(downloadButton);
				setMarginsLinearLayout(downloadButton, 0, MARGIN_HORIZONTAL_SMALL, 0, MARGIN_HORIZONTAL_BIG);
	
				var exitButton = new android.widget.Button(currentActivity); 
				exitButton.setText("Close"); 
				exitButton.setOnClickListener(new android.view.View.OnClickListener()
				{
					onClick: function()
					{
						popup.dismiss();
					}
				}); 
				layout.addView(exitButton);
				setMarginsLinearLayout(exitButton, 0, MARGIN_HORIZONTAL_SMALL, 0, MARGIN_HORIZONTAL_SMALL);
				

				popup.show();
			
			}catch(err)
			{
				clientMessage("Error: " + err);
			}
		}
	});
}

