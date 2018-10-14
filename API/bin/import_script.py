import csv
from urllib.request import urlopen
import xml.etree.ElementTree as ET

SEARCH_URL = "https://www.boardgamegeek.com/xmlapi/search?search="
DETAILS_URL = "https://www.boardgamegeek.com/xmlapi/boardgame/"

def getGameId(title):
    id = None
    title = title.replace(" ", "%20")

    contents = urlopen(SEARCH_URL + title + "&exact=1").read()
    root = ET.fromstring(contents)

    for child in root:
        if (child.tag == "boardgame"):
            id = child.attrib['objectid']

    return id

def handleSkippedGames(games):
    file = open("skipped_games.csv", "w")
    file.write("Title, Copies, Condition, Expansion, Show in the Main Screen\n")

    for game in games:
        string = ""
        for detail in game:
            string += detail + ","
        file.write(string + "\n")

    file.close()

def getGameDetails(games):
    ids = ""
    for id in games.keys():
        ids = ids + id + ","

    contents = urlopen(DETAILS_URL + ids + "?stats=1").read()
    root = ET.fromstring(contents)

    for boardgame in root.iter('boardgame'):
        id = boardgame.attrib['objectid']

        for child in boardgame:
            games[id]["category"] = ""
            games[id]["year_published"] = "0"
            games[id]["min_players"] = "0"
            games[id]["max_players"] = "0"
            games[id]["min_playtime"] = "0"
            games[id]["max_playtime"] = "0"
            games[id]["description"] = ""
            games[id]["thumbnail"] = ""
            games[id]["image"] = ""
            games[id]["users_rated"] = "0"
            games[id]["rating"] = "0"
            games[id]["complexity"] = "0"

            if (child.tag == "boardgamesubdomain"):
                games[id]["category"] = child.text.partition(' ')[0]

            elif (child.tag == "yearpublished"):
                games[id]["year_published"] = child.text

            elif (child.tag == "minplayers"):
                games[id]["min_players"] = child.text

            elif (child.tag == "maxplayers"):
                games[id]["max_players"] = child.text

            elif (child.tag == "minplaytime"):
                games[id]["min_playtime"] = child.text

            elif (child.tag == "maxplaytime"):
                games[id]["max_playtime"] = child.text

            elif (child.tag == "description"):
                games[id]["description"] = child.text.partition('<br/>')[0].replace("'", "''")

            elif (child.tag == "thumbnail"):
                games[id]["thumbnail"] = child.text

            elif (child.tag == "image"):
                games[id]["image"] = child.text

            elif (child.tag == "statistics"):
                for ratings in child.iter("ratings"):
                    for info in ratings:
                        if (info.tag == "usersrated"):
                            games[id]["users_rated"] = info.text

                        elif (info.tag == "average"):
                            games[id]["rating"] = info.text[:4]

                        elif (info.tag == "averageweight"):
                            games[id]["complexity"] = info.text[:3]


def createScript(games):
    file = open("import_script.pgsql", "w")
    file.write("INSERT INTO Games (title, category, rating, min_players, max_players, min_playtime, max_playtime, year_published, description, complexity, users_rated, available_copies, total_copies, condition, expansion_of, bgg_id, show_main_page, thumbnail, image) VALUES ")

    string = ""
    for id in games.keys():
        if (games[id]['show_main_page'] == "n"):
            games[id]['show_main_page'] = "false"
        else:
            games[id]['show_main_page'] = "true"

        string += "('" + games[id]['title'] + "', '" + games[id]['category'] + "', " + games[id]['rating'] + ", " + games[id]['min_players']
        string += ", " + games[id]['max_players'] + ", " + games[id]['min_playtime'] + ", " + games[id]['max_playtime'] + ", "
        string += games[id]['year_published'] + ", '" + games[id]['description'] + "', " + games[id]['complexity'] + ", "
        string += games[id]['users_rated'] + ", " + games[id]['copies'] + ", " + games[id]['copies'] + ", '" + games[id]['condition']
        string += "', '" + games[id]['expansion'] + "' ," + id + ", " + games[id]['show_main_page'] + ", '" + games[id]['thumbnail'] + "', '"
        string += games[id]['image'] + "'),\n"

    file.write(string[:len(string)-2] + ";")
    file.close()

def main():
    with open('example.csv') as csvfile:
        readCSV = csv.reader(csvfile, delimiter = ',')
        games = {}
        skipped_games = []
        for row in readCSV:
            id = getGameId(row[0])
            if (id == None):
                skipped_games.append(row)
                continue

            games[id] = {}
            games[id]['title']= row[0]

            if (len(row) > 1 and row[1] != ""):
                games[id]['copies'] = row[1]
            else:
                games[id]['copies'] = '1'

            if (len(row) > 2 and row[2] != ""):
                games[id]['condition'] = row[2]
            else:
                games[id]['condition'] = "OK"

            if (len(row) > 3 and row[3] != ""):
                games[id]['expansion'] = row[3]
            else:
                games[id]['expansion'] = ""

            if (len(row) > 4 and row[4] != ""):
                games[id]['show_main_page'] = row[4]
            else:
                games[id]['show_main_page'] = "n"

        handleSkippedGames(skipped_games)
        getGameDetails(games)
        createScript(games)

main();
