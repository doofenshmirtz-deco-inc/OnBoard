from pytimeparse.timeparse import timeparse

classes_file = open("classes/Matthew_Low_matt.txt")

class_objects = []

print(classes_file.readline())
classes = [a.split("\t") for a in classes_file.readlines()]
for cl in classes:
    class_objects.append({
        'code': cl[0],
        'description': cl[1],
        'group': cl[2],
        'activity': cl[3],
        'day': cl[4],
        'time': cl[5],
        # Output duration in minutes
        'duration': timeparse(cl[10]) // 60
    })

print(class_objects)

classes_file.close()