def _cleanAndReturnOutput(drops):
    output = []
    for d in drops:
        if d:
            output.append('->'.join(d))
    
    output.sort()
    return ','.join(output)

def swapDrops(drops, dropA, dropB):
    dropAList, dropBList = [], []
    for drop in drops:
        for i, d in enumerate(drop):
            if d == dropA:
                dropAList = drop
                dropAIndex = i
            elif d == dropB:
                dropBList = drop
                dropBIndex = i
    if not dropAList or not dropBList:
        # either or both drops not found
        return 'INVALID'
    
    # Swap the two drops
    dropAList[dropAIndex] = dropB
    dropBList[dropBIndex] = dropA
    
    # Clean output and return
    return _cleanAndReturnOutput(drops)

def removeDrop(drops, dropA):
    # drop can be head, tail or in the middle
    elementFound = False
    for drop in drops:
        for i, d in enumerate(drop):
            if d == dropA:
                elementFound = True
                drop.pop(i)
    if elementFound:
        # return actual drops
        return _cleanAndReturnOutput(drops)
    else:
        return 'INVALID'
    

def addDrop(drops, dropA, dropB):
    dropAList, dropBList = [], []
    for drop in drops:
        for i, d in enumerate(drop):
            if d == dropB:
                # found the child drop
                dropBList = drop
                dropBIndex = i
            elif d == dropA:
                # found the parent drop
                dropAList = drop
                dropAIndex = i
    
    if not dropAList or not dropBList:
        # either or both drops not found
        return 'INVALID'
    
    # If the parent and child are in the same list
    # and child is before parent, return INVALID
    if dropAList == dropBList and dropBIndex < dropAIndex:
        return 'INVALID'
        
    
    # Slice off child and append to parent
    dropAList[dropAIndex + 1: dropAIndex + 1] = dropBList[dropBIndex:]
    # Remove the child drops from that list
    del dropBList[dropBIndex:]
    
    # Check for loops
    for drop in drops:
        if len(drop) != len(set(drop)):
            return "INVALID"
    
    # Clean output and return
    return _cleanAndReturnOutput(drops)

def solution(drops, dropsToOperateOn, operation):
    # Please write your code here.
    dropsSplit = drops.split(',') # Get all the drops
    drops = []
    for drop in dropsSplit:
        drops.append(drop.split('->')) # Split each drop using ->
    if operation == "swap":
        try:
            dropA, dropB = dropsToOperateOn.split(',')
        except:
            return "INVALID"
        return swapDrops(drops, dropA, dropB)
    elif operation == "remove":
        return removeDrop(drops, dropsToOperateOn)
    elif operation == "add":
        try:
            dropA, dropB = dropsToOperateOn.split(',')
        except:
            return "INVALID"
        return addDrop(drops, dropA, dropB)
    else:
        return "INVALID"
    
    
solution("A->B->C->D,E", "E,B", "add")
