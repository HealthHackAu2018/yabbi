from yabbi.blueprints.action.helper import *
from yabbi.blueprints.action.communication import Communication
from threading import Lock

mutex = Lock()

class TestMain(object):
    """
    Initialises a reciever object. Initialises it with
    null values for the connection and mutex.
    Tests the functions that don't use the connection object.
    """
    def test_run(self):
        """
        Tests the communication service runs as expected
        """
