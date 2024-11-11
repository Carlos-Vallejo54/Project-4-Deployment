import sqlite3

def dict_factory(cursor, row):
    fields = []
    for column in cursor.description:
        fields.append(column[0])
    
    result_dict = {}
    for i in range(len(fields)):
        result_dict[fields[i]] = row[i]
    
    return result_dict

class ReviewedItemDB:
    def __init__(self, filename):
        self.connection = sqlite3.connect(filename)
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()

    def getReviewedItems(self):
        self.cursor.execute("SELECT * FROM revieweditems")
        return self.cursor.fetchall()
    
    def getReviewedItem(self, item_id):
        self.cursor.execute("SELECT * FROM revieweditems WHERE id = ?", (item_id,))
        return self.cursor.fetchone()

    def createReviewedItem(self, content_type, name, rating, release_year, genre):
        data = (content_type, name, rating, release_year, genre)
        self.cursor.execute("INSERT INTO revieweditems (content_type, name, rating, release_year, genre) VALUES (?, ?, ?, ?, ?)", data)
        self.connection.commit()

    def updateContent(self, content_type, name, rating, release_year, genre, item_id):
        data = (content_type, name, rating, release_year, genre, item_id)
        self.cursor.execute("UPDATE revieweditems SET content_type = ?, name = ?, rating = ?, release_year = ?, genre = ? WHERE id = ?", data)
        self.connection.commit()

    def deleteReviewedItem(self, item_id):
        self.cursor.execute("DELETE FROM revieweditems WHERE id = ?", (item_id,))
        self.connection.commit()

    def close(self):
        self.connection.close()