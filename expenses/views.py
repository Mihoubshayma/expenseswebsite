from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Category, Expense
from django.contrib import messages
from django.shortcuts import render, redirect
import json
from django.http import JsonResponse, HttpResponse
import csv
import datetime
from django.http import JsonResponse
from .models import Expense
import json

def search_expenses(request):
    if request.method == 'POST':
        # On récupère le texte de recherche envoyé via la requête JSON
        search_str = json.loads(request.body).get('searchText', '')

        # Recherche des dépenses correspondant au texte de recherche
        expenses = Expense.objects.filter(
            amount__istartswith=search_str, owner=request.user
        ) | Expense.objects.filter(
            date__istartswith=search_str, owner=request.user
        ) | Expense.objects.filter(
            description__icontains=search_str, owner=request.user
        ) | Expense.objects.filter(
            category__icontains=search_str, owner=request.user
        )

        # Récupération des données sous forme de dictionnaire
        data = list(expenses.values('id', 'amount', 'category', 'description', 'date'))

        # Retour des résultats sous forme de JSON
        return JsonResponse(data, safe=False)


@login_required(login_url='/authentification/login')


def index(request):
    expenses = Expense.objects.filter(owner=request.user).order_by('-date')
    categories = Category.objects.all()
    context = {
        'expenses': expenses,
        'categories': categories,
    }
    return render(request, 'expenses/index.html', context)

def add_expense(request):
    categories = Category.objects.all()
    context = {
        'categories': categories,
        'values': request.POST
    }
    if request.method == 'GET':
        return render(request, 'expenses/add_expense.html', context)

    if request.method == 'POST':
        amount = request.POST['amount']

        if not amount:
            messages.error(request, 'Remplie le formulaire svp ')
            return render(request, 'expenses/add_expense.html', context)
        description = request.POST['description']
        date = request.POST['expense_date']
        category = request.POST['category']

        if not description:
            messages.error(request, 'description is required')
            return render(request, 'expenses/add_expense.html', context)

        Expense.objects.create(owner=request.user, amount=amount, date=date,
                               category=category, description=description)
        messages.success(request, 'Expense saved successfully')

        return redirect('expenses')


def expense_edit(request, id):
    expense = Expense.objects.get(pk=id)
    categories = Category.objects.all()
    context = {
        'expense': expense,
        'values': expense,
        'categories': categories
    }
    if request.method == 'GET':
        return render(request, 'expenses/edit-expense.html', context)
    if request.method == 'POST':
        amount = request.POST['amount']

        if not amount:
            messages.error(request, 'Amount is required')
            return render(request, 'expenses/edit-expense.html', context)
        description = request.POST['description']
        date = request.POST['expense_date']
        category = request.POST['category']

        if not description:
            messages.error(request, 'description is required')
            return render(request, 'expenses/edit-expense.html', context)

        expense.owner = request.user
        expense.amount = amount
        expense. date = date
        expense.category = category
        expense.description = description

        expense.save()
        messages.success(request, 'Expense updated  successfully')

        return redirect('expenses')




def expense_delete(request, id):
    expense = Expense.objects.get(pk=id)
    expense.delete()
    messages.success(request, 'Expense removed')
    return redirect('expenses')


def expense_category_summary(request):
    todays_date = datetime.date.today()
    six_months_ago = todays_date - datetime.timedelta(days=30*6)

    expenses = Expense.objects.filter(owner=request.user,
                                       date__gte=six_months_ago,
                                       date__lte=todays_date)

    category_data = {}
    monthly_data = {}

    for expense in expenses:
        # Per categoria
        category = expense.category
        amount = expense.amount
        if category in category_data:
            category_data[category] += amount
        else:
            category_data[category] = amount

        # Per mese
        month = expense.date.strftime('%B')  # es: 'January', 'February'
        if month in monthly_data:
            monthly_data[month] += amount
        else:
            monthly_data[month] = amount

    return JsonResponse({
        'expense_category_data': category_data,
        'monthly_expense_data': monthly_data
    }, safe=False)


def stats_view(request):
    return render(request, 'expenses/stats.html')


def export_csv(request):
    # Créer une réponse HTTP avec le bon type MIME pour le CSV
    response = HttpResponse(content_type='text/csv')
    
    # Définir le nom du fichier CSV avec la date et l'heure actuelles
    response['Content-Disposition'] = 'attachment; filename=Expenses_' + str(datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')) + '.csv'

    # Créer un writer pour écrire dans la réponse HTTP
    writer = csv.writer(response)

    # Écrire les en-têtes du fichier CSV
    writer.writerow(['Amount', 'Description', 'Category', 'Date'])

    # Récupérer les dépenses de l'utilisateur actuel
    expenses = Expense.objects.filter(owner=request.user)

    # Ajouter les données des dépenses dans le fichier CSV
    for expense in expenses:
        writer.writerow([expense.amount, expense.description, expense.category, expense.date])

    # Retourner la réponse HTTP avec le fichier CSV généré
    return response





