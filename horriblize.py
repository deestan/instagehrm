import subprocess
import sys
from random import randint, uniform

def horriblize(source, output):
    # convert to png and crop to 1000x750 or 750x1000
    rotateLandscape, dimensions = prepare(source, output)

    # crop faces to edge
    cropFace = cropFaces(output, dimensions[0], dimensions[1])

    # resize to 800x600
    resize = ['-resize', '800x600']

    # add shit photographer effects
    shit = shitPhotographer()

    # 25% chance to leave in wrong orientation
    rotateBack = []
    if len(rotateLandscape) > 0 and randint(0, 4) != 0:
        rotateBack = ['-rotate', '-90']

    # OUTPUT
    ops = " ".join(cropFace + rotateLandscape + resize + shit + rotateBack)
    subprocess.check_call("convert " + output + " " + ops + " " + output,
                          shell=True)

def prepare(source, output):
    imgdata = subprocess.check_output("identify " + source, shell=True)
    width, height = map(int, imgdata.split(' ')[2].split("x"))
    newWidth, newHeight = 1000, 750
    rotationOp = []
    if width < height:
        newWidth, newHeight = 750, 1000
        rotationOp = ['-rotate', '90']
    cmd = " ".join([
            'convert', source,
            '-resize', '"%dx%d^"'%(newWidth, newHeight),
            '-gravity', 'center',
            '-crop', '%dx%d+0+0'%(newWidth, newHeight),
            '-gravity', 'northwest',
            output])
    subprocess.check_call(cmd, shell=True)
    return rotationOp, (newWidth, newHeight)

def shitPhotographer():
    # assume 800x600
    shake = ['-motion-blur', '%dx%d+%d'%(randint(5, 20),
                                         randint(5, 20),
                                         randint(0, 360))]
    darken = ['-gamma', '%0.1f'%uniform(0.5, 1.0)]
    badiso = ['-attenuate', '0.2', '+noise', 'multiplicative']
    whiteunbalance = ['-colorspace', 'CMY', '-channel', 'Y',
                      '-gamma', '%0.1f'%uniform(1.1, 2.0),
                      '-colorspace', 'RGB', '-channel', 'RGB']
    return shake + darken + whiteunbalance + badiso

def cropFaces(src, width, height):
    faceRaw = subprocess.check_output("./bbfdetect " + src + " face",
                                      shell=True)
    faces = faceRaw.split("\n")
    topIncision = height
    horizontalIncision = width
    isLeft = True
    for face in faces:
        if face.startswith("total"):
            break
        bitz = face.split(" ")
        x, y, w, h = map(int, bitz[:4])
        confidence = float(bitz[4])
        if confidence > -0.5:
            if y < topIncision:
                topIncision = y
            if x < horizontalIncision:
                horizontalIncision = x
                isLeft = True
            faceRight = width - (x + w)
            if faceRight < horizontalIncision:
                horizontalIncision = faceRight
                isLeft = False

    if topIncision > height * 0.4:
        topIncision = 0
    if horizontalIncision > width * 0.4:
        horizontalIncision = 0
        isLeft = True

    if topIncision == 0 and horizontalIncision == 0:
        return []

    newWidth = width - horizontalIncision
    newHeight = height - topIncision
    ratio = float(width) / height
    while float(newWidth) / newHeight < ratio:
        newHeight -= 1
    while float(newWidth) / newHeight > ratio:
        newWidth -= 1

    fromLeft = horizontalIncision
    if not isLeft:
        fromLeft = width - horizontalIncision - newWidth
    
    geometry = '%dx%d+%d+%d'%(newWidth, newHeight, fromLeft, topIncision)
    return ['-crop', geometry]

source = sys.argv[1]
target = "OUTPUT.png"
if len(sys.argv) > 2:
    target = sys.argv[2]
horriblize(source, target)
