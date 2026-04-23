import sqlite3
import os
class Database:
    def __new__(cls):
        if not hasattr(cls, 'inst'):
            cls.inst = super().__new__(cls)
        return cls.inst



def init():
    db = Database()
    Database.con = sqlite3.connect(f"{os.path.dirname(os.path.realpath(__file__))}/db.db")