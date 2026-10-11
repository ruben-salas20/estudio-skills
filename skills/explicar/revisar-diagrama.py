import sys
C={'─':'LR','┈':'LR','│':'UD','┊':'UD','┌':'RD','┐':'LD','└':'UR','┘':'UL','├':'UDR','┤':'UDL','┬':'LRD','┴':'LRU','┼':'LRUD','▼':'U','▲':'D','►':'L','◄':'R'}
OPP={'L':'R','R':'L','U':'D','D':'U'};MV={'L':(0,-1),'R':(0,1),'U':(-1,0),'D':(1,0)}
g=[l.rstrip('\n') for l in (open(sys.argv[1]) if len(sys.argv)>1 else sys.stdin)]
at=lambda r,c: g[r][c] if 0<=r<len(g) and 0<=c<len(g[r]) else ' '
err=[]
for r,l in enumerate(g):
  for c,ch in enumerate(l):
    for d in C.get(ch,''):
      n=at(r+MV[d][0],c+MV[d][1])
      if n==' ' or (n in C and OPP[d] not in C[n]): err.append(f"línea {r+1}, col {c+1}: '{ch}' apunta {d} y encuentra '{n}'")
    tip={'▼':'D','▲':'U','►':'R','◄':'L'}.get(ch)
    if tip and at(r+MV[tip][0],c+MV[tip][1])==' ': err.append(f"línea {r+1}, col {c+1}: flecha '{ch}' no toca nada")
print(f"{len(err)} errores"); [print('  ',e) for e in err]
