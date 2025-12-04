import csv

def main():
    # This section sorts the Costco API data
    send_to_front_end_costco = []
    with open("costco_api_data.csv", "r", newline="") as unsorted_costco_file:
        reader = csv.reader(unsorted_costco_file)
        for row in reader:
            row_text = " ".join(row).lower()
            if "name" in row_text or "brand" in row_text or "price" in row_text:
                send_to_front_end_costco.append(row)
    # This section writes the sorted Costco data into a new file
    with open("sorted_costco_api_data.csv", "w") as sorted_costco_file:
        for line in send_to_front_end_costco:
            sorted_costco_file.write(f"{line},")

    # This section sorts the Sam's Club API data
    send_to_front_end_samsclub = []
    with open("costco_api_data.csv", "r", newline="") as unsorted_samsclub_file:
        reader = csv.reader(unsorted_samsclub_file)
        for row in reader:
            row_text = " ".join(row).lower()
            if "name" in row_text or "brand" in row_text or "price" in row_text:
                send_to_front_end_samsclub.append(row)
    # This section writes the sorted Sam's Club data into a new file
    with open("sorted_samsclub_api_data.csv", "w") as sorted_samsclub_file:
        for line in send_to_front_end_samsclub:
            sorted_samsclub_file.write(f"{line},")

if __name__ == "__main__":
    main()