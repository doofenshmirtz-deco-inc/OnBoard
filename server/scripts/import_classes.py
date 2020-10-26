from pytimeparse.timeparse import timeparse
from collections import defaultdict
import dateparser
import datetime
import csv
import pprint
import os
import graphene

def parse_file(filename):
    # Deal with stupid double tabs and newlines in Allocate+ output
    with open(filename, "r+") as file:
        content = file.read()
        file.seek(0)
        file.truncate()
        file.write(content.replace('\t\t', '\t').replace('\n\n', ''))

    with open(filename, "r") as csvfile:
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
                'courseLevel': "Undergraduate" if int(code[4]) < 7 else "Postgraduate",
                'year': 2020,
                'students': [filename.split("_")[2].split(".txt")[0]]
            })

            if "LEC" in line['Group']:
                course_type = "Lecture"
            elif "TUT" in line['Group']:
                course_type = "Tutorial"
            elif "PRA" in line['Group']:
                course_type = "Practical"
            else:
                course_type = "Lecture"

            dates = [dateparser.parse(j, settings={'DATE_ORDER': 'DMY'})
                     + datetime.timedelta(minutes=timeparse(line['Time'])) for i in line['Dates'].split(", ") for j in i.split("-")]

            date_starts, date_ends = [dates[0], dates[2]], [dates[1], dates[3]]
            dates_full = []

            for i in range(len(date_starts)):
                current_date = date_starts[i]
                dates_full.append(current_date)
                while current_date < date_ends[i]:
                    current_date += datetime.timedelta(days=7)
                    dates_full.append(current_date)

            # print(dateparser.parse(line['Dates']) + datetime.timedelta(minutes=timeparse(line['Time'])))

            classes.append({
                'name': line['Group'] + "-" + line['Activity'],
                'type': course_type,
                'course': code,
                'users': [filename.split("_")[2].split(".txt")[0]],
                'duration': timeparse(line['Duration']) // 60,
                'dates': dates_full
            })

        # Unique courses only
        # courses = [dict(t) for t in {tuple(d.items()) for d in courses}]
        return courses, classes


if __name__ == "__main__":
    files = os.listdir("classes")
    if '.DS_Store' in files:
        files.remove('.DS_Store')
    all_courses = []
    all_classes = []
    for file in files:
        print("-----------------", file, "-----------------")
        courses, classes = parse_file(os.path.join("classes", file))
        all_courses += courses
        all_classes += classes

    all_courses = sorted(all_courses, key=lambda i: i['code'])
    all_classes = sorted(all_classes, key=lambda i: i['course'])

    merged_courses = []
    merged_classes = []

    # Construct user list for each course
    for dictionary in all_courses:
        if len(list(filter(lambda a: a['name'] == dictionary['name']
                           and a['code'] == dictionary['code'], merged_courses))) == 0:
            merged_courses.append(dictionary)
        else:
            next(filter(lambda a: a['name'] == dictionary['name']
                        and a['code'] == dictionary['code'], merged_courses))["students"].extend(dictionary["students"])

    for dictionary in merged_courses:
        dictionary['students'] = list(set(dictionary['students']))

    # Construct user list for each course
    for dictionary in all_classes:
        if len(list(filter(lambda a: a['name'] == dictionary['name']
                           and a['course'] == dictionary['course'], merged_classes))) == 0:
            merged_classes.append(dictionary)
        else:
            next(filter(lambda a: a['name'] == dictionary['name']
                        and a['course'] == dictionary['course'], merged_classes))["users"].extend(dictionary["users"])

    pprint.pprint(merged_courses)
    pprint.pprint(merged_classes)