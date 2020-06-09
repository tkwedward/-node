from django.conf.urls.static import static
from django.conf import settings
from django.urls import include, path
from .views import getEquationList, getJSON, tocPage, noteEditInterface, notePage, processAjaxRequest, pdfNote, collectionPage, questionBankPage, recordPage, pdfEditor, solutionPage, videoPlayer, processVideoSave, grePage, greProcessData, staticPage, youtubeVideoPage, generalizedQuiz, generalQuizProcessData

urlpatterns = [
    path('static', staticPage, name="staticPage"),
    path('', getEquationList, name="homepage"),
    path('getJSON', getJSON, name="getJSON"),
    path('TOC', tocPage, name="tocPage"),
    path('note', noteEditInterface, name="noteIndex"),
    path('collection/<slug:title>', collectionPage, name="noteIndex"),
    path('GRE', grePage, name="grePage"),
    path("terms", generalizedQuiz, name="generalizedQuiz"),
    path('generalQuizProcessData', generalQuizProcessData, name="generalQuizProcessData"),
    path('greProcessData', greProcessData, name="greProcessData"),



    path('video', videoPlayer, name="videoPlayer"),

    path('solution/<slug:title>', solutionPage, name="solutionPage"),
    path('pdfNote/<str:title>/<str:chapter>', pdfNote, name="pdfNote"),
    path('pdfEditor', pdfEditor, name="pdfEditor"),

    path('note/<str:title>/<str:chapter>', notePage, name="notePage"),
    path('processData', processAjaxRequest, name="processData"),
    path('questionBank', questionBankPage, name="questionBank"),
    path('record', recordPage, name="recordPage"),


    path('processVideoSave', processVideoSave, name="processVideoSave"),
    path('yotube', youtubeVideoPage, name="youtubeVideoPage"),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
