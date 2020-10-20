from pytimeparse.timeparse import timeparse
import csv

# Deal with stupid double tabs in Allocate+ output
with open("classes/Matthew_Low_matt.txt", "r+") as file:
    content = file.read()
    file.seek(0)
    file.truncate()
    file.write(content.replace('\t\t', '\t'))

with open("classes/Matthew_Low_matt.txt", "r") as csvfile:
    # Deal with extra tab
    courses = []
    classes = []

    reader = csv.DictReader(csvfile, delimiter="\t")
    for line in reader:
        code, sem, _, _ = line['Subject Code'].split("_")
        courses.append({
            'code': code,
            'name': line['Description'],
            'semester': sem,
            'level': "CourseLevel.Undergrad" if int(code[4]) < 7 else "CourseLevel.Postgrad",
            'year': 2020
        })

        if "LEC" in line['Group']:
            course_type = "ClassType.Lecture"
        elif "TUT" in line['Group']:
            course_type = "ClassType.Tutorial"
        elif "PRA" in line['Group']:
            course_type = "ClassType.Practical"
        else:
            course_type = "ClassType.Lecture"

        classes.append({
            'name': line['Group'],
            'type': course_type,
            'course': code,
            'users': [],
            'duration': timeparse(line['Duration']) // 60,
        })

    # Unique courses only
    courses = [dict(t) for t in {tuple(d.items()) for d in courses}]
    print(courses)
    print(classes)

    # course_objects = set()
    # class_objects = []

    # file.readline()
    # classes = [a.split("\t") for a in file.readlines()]
    # for cl in classes:
    #     course_objects.append({
    #         'code': cl['code']
    #     })

    #     class_objects.append({
    #         'code': cl[0],
    #         'description': cl[1],
    #         'group': cl[2],
    #         'activity': cl[3],
    #         'day': cl[4],
    #         'time': cl[5],
    #         # Output duration in minutes
    #         'duration': timeparse(cl[10]) // 60
    #     })

    # print(class_objects)