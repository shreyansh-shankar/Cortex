from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def projects():
    return render_template('projects.html')

@app.route("/task")
def task_page():
    task_id = request.args.get("taskId")
    if not task_id:
        return "Task ID not provided", 400
    return render_template("task.html", task_id=task_id)

if __name__ == '__main__':
    app.run(debug=True)
