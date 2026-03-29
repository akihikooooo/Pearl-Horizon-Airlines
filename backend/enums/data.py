from enum import Enum

class RouteStructure(str, Enum):
    oneway = "oneway"
    roundtrip = "roundtrip"