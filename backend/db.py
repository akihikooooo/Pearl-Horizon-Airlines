import os
import sqlite3


class Database:
    def __new__(cls):
        if not hasattr(cls, "inst"):
            cls.inst = super().__new__(cls)
        return cls.inst


def init():
    Database()
    Database.con = sqlite3.connect(
        f"{os.path.dirname(os.path.realpath(__file__))}/db.db", check_same_thread=False
    )
