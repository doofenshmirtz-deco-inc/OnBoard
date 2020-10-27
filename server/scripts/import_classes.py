from pytimeparse.timeparse import timeparse
from collections import defaultdict
from graphqlclient import GraphQLClient
from datetime import datetime
import dateparser
import datetime
import csv
import pprint
import os
import json
import time


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
            sem = "One" if "S1" else "Two"
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
                dates_full.append(current_date - datetime.timedelta(hours=10))
                while current_date < date_ends[i]:
                    current_date += datetime.timedelta(days=7)
                    # UTC+10, dodgy lol
                    dates_full.append(
                        current_date - datetime.timedelta(hours=10))

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

    client = GraphQLClient('https://onboard.doofenshmirtz.xyz/graphql')

    token = json.loads(client.execute('''
    {
        getTestingToken(testUID: "doof-uid") {
            token
        }
    }
    '''))['data']['getTestingToken']['token']

    client.inject_token(token)

    course_to_id = {}
    for course in merged_courses:

        result = client.execute('''
mutation AddCourse($course: courseInput!) {
    addCourse(course: $course) {
        code
        name
        semester
        courseLevel
        year
        id
    }
}''', variables=f'''
{{
    "course": {{
        "code": "{course['code']}",
        "name": "{course['name']}",
        "semester": "{course['semester']}",
        "courseLevel": "{course['courseLevel']}",
        "year": {course['year']},
        "students": {str(course['students']).replace("'", '"')}
    }}
}}
''')
        json_result = json.loads(result)['data']['addCourse']
        course_to_id[json_result['code']] = json_result['id']

    for classs in merged_classes:
        dates = [i.strftime("%Y-%m-%dT%H:%M:%SZ") for i in classs['dates']]
        result = client.execute('''
mutation AddClass($classData: ClassGroupInput!) {
  addClassGroup(classData: $classData) {
    users {
      id
    }
    course {
      name
    }
    name
    type
    times
    duration
  }
}''', variables=f'''
{{
    "classData": {{
        "courseID": {course_to_id[classs['course']]},
        "name": "{classs['name']}",
        "type": "{classs['type']}",
        "times": {str(dates).replace("'", '"')},
        "duration": {classs['duration']},
        "uids": {str(classs['users']).replace("'", '"')}
    }}
}}
''')
        print(json.loads(result)['data']['addClassGroup'])
