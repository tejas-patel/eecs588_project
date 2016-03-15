import sys
from bs4 import BeautifulSoup as Soup


#file = sys.argv[1]


handler = sys.stdin.read()

soup = Soup(handler)

if soup.compressionmethod:
    print soup.target['host'],soup.target['ip'], soup.compressionmethod['issupported']

