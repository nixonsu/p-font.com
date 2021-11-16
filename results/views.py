from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
@csrf_exempt
def index(request):
  if request.method == "POST":
    data = json.loads(request.body)
    print(data)
    return HttpResponse(status=200)

  return render(request, 'results/index.html', data)