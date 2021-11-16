from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logging.basicConfig(level = logging.INFO)
logger = logging.getLogger(__name__)


# Create your views here.
@csrf_exempt
def index(request):
  if request.method == "POST":
    content = json.loads(request.body)
    # Store data in current user session
    request.session['data'] = content
    return redirect(request.path)

  if request.method == "GET":
    # Retreive data from current user session
    data = request.session.get('data', False)
    
    return render(request, 'results/index.html', data)